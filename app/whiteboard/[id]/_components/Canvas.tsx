"use client";

import {
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
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
  useSelf,
  useStorage,
} from "@/liveblocks.config";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";
import {
  PointerEvent,
  WheelEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import CursorPresence from "./CursorPresence";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";
import LayerPreview from "./layers/LayerPreview";
import SelectionBox from "./layers/SelectionBox";
import SelectionTools from "./layers/SelectionTools";
import Path from "./layers/Path";
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce";
import { useKeyEvent } from "@/hooks/useKeyEvent";

const MAX_LAYERS = 100;

const Canvas = ({ boardId }: { boardId: string }) => {
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  useDisableScrollBounce();
  useKeyEvent();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const pencilDraft = useSelf((self) => self.presence.pencilDraft);
  const layerIds = useStorage((root) => root.layerIds);

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Rectangle
        | LayerType.Ellipse
        | LayerType.Note
        | LayerType.Text,
      position: Point,
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();

      let width;
      switch (layerType) {
        case LayerType.Note:
          width = 250;
          break;
        case LayerType.Text:
          width = 200;
          break;
        default:
          width = 100;
      }

      let height;
      switch (layerType) {
        case LayerType.Note:
          height = 300;
          break;
        default:
          height = 100;
      }

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: height,
        width: width,
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

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current,
      );
      setMyPresence({ selection: ids });
    },
    [layerIds],
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor],
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: PointerEvent) => {
      const { pencilDraft, penColor } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState, lastUsedColor],
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const pencilDraft = self.presence.pencilDraft;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        null;
      }

      const id = nanoid();

      const obj = penPointsToPathLayer(pencilDraft, lastUsedColor);

      if (obj == null) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      liveLayers.set(id, new LiveObject(obj));

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });

      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor],
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

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyPresence({
        cursor: current,
      });
    },
    [
      camera,
      canvasState,
      resizeSelectedLayer,
      translateSelectedLayer,
      updateSelectionNet,
      startMultiSelection,
      continueDrawing,
    ],
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
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, insertLayer, history, unselectLayers, insertPath],
  );

  const onPointerDown = useMutation(
    ({ setMyPresence }, e: PointerEvent<SVGSVGElement>) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) return null;

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(current, e.pressure);
        return;
      }

      setCanvasState({ mode: CanvasMode.Pressing, origin: current });
    },
    [camera, canvasState.mode, startDrawing],
  );

  const onLayerPointerDown = useMutation(
    (
      { self, setMyPresence },
      e: PointerEvent<
        SVGRectElement | SVGEllipseElement | SVGForeignObjectElement
      >,
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
        onPointerDown={onPointerDown}
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
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-primary stroke-primary stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                fillOpacity={0.05}
              />
            )}
          <CursorPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path points={pencilDraft} fill={lastUsedColor} x={0} y={0} />
          )}
        </g>
      </svg>
    </main>
  );
};

export default memo(Canvas);
