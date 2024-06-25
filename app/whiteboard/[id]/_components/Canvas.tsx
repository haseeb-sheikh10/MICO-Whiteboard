"use client";

import {
  pointerEventToCanvasPoint,
  randomColor,
  resizeBounds,
} from "@/lib/utils";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@/liveblocks.config";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  InsertLayers,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { nanoid } from "nanoid";
import {
  PointerEvent,
  PointerEventHandler,
  WheelEvent,
  WheelEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import CursorPresence from "./CursorPresence";
import Info from "./Info";
import LayerPreview from "./layers/LayerPreview";
import Participants from "./Participants";
import Toolbar from "./Toolbar";
import SelectionBox from "./layers/SelectionBox";
import { LiveObject } from "@liveblocks/client";
import SelectionTools from "./layers/SelectionTools";

const MAX_LAYERS = 100;

const Canvas = ({ boardId }: { boardId: string }) => {
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  });

  const layerIds = useStorage((root) => root.layerIds);

  const insertLayer = useMutation(
    ({ storage, setMyPresence }, layerType: InsertLayers, position: Point) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor, MAX_LAYERS],
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState],
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState],
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent<SVGSVGElement>) => {
      if (e.ctrlKey) {
        const zoomFactor = 0.02;
        let newScale = scale;
        if (e.deltaY < 0) {
          newScale = scale + zoomFactor;
        } else {
          newScale = scale - zoomFactor;
        }
        setScale(Math.max(0.1, newScale));
      } else {
        setCamera((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    [scale],
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: PointerEvent<SVGSVGElement>) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }
      setMyPresence({
        cursor: current,
      });
    },
    [camera, canvasState, resizeSelectedLayer, translateSelectedLayer],
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }, e: PointerEvent<SVGSVGElement>) => {
      e.preventDefault();
      setMyPresence({
        cursor: null,
      });
    },
    [],
  );

  const onPointerUp = useMutation(
    ({}, e: PointerEvent<SVGSVGElement>) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, insertLayer, history, unselectLayers],
  );

  const onLayerPointerDown = useMutation(
    (
      { self, setMyPresence },
      e: PointerEvent<SVGRectElement>,
      layerId: string,
    ) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);

      const notSelected = !self.presence.selection.includes(layerId);

      if (notSelected) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [camera, canvasState.mode, history],
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const result = new Map<string, string>();

    for (const [connectionId, selection] of selections) {
      for (const layerId of selection) {
        result.set(layerId, randomColor(connectionId));
      }
    }

    return result;
  }, [selections]);

  return (
    <main className="h-screen w-full relative bg-amber-50 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools
        camera={camera}
        scale={scale}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        className="h-[100vh] w-[100vw]"
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${scale})`,
          }}
        >
          {layerIds.map((id) => (
            <LayerPreview
              key={id}
              id={id}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection.get(id)}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <CursorPresence />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
