import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { useMemo } from "react";
import ToolButton from "./ToolButton";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canRedo,
  canUndo,
}: ToolbarProps) => {
  const toolsSchema = useMemo(
    () => [
      {
        label: "Select",
        icon: MousePointer2,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.None,
          }),
        isActive:
          CanvasMode.None === canvasState.mode ||
          CanvasMode.SelectionNet === canvasState.mode ||
          CanvasMode.Translating === canvasState.mode ||
          CanvasMode.Resizing === canvasState.mode ||
          CanvasMode.Pressing === canvasState.mode,
      },
      {
        label: "Text",
        icon: Type,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text,
          }),
        isActive:
          CanvasMode.Inserting === canvasState.mode &&
          LayerType.Text === canvasState.layerType,
      },
      {
        label: "Sticky Note",
        icon: StickyNote,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note,
          }),
        isActive:
          CanvasMode.Inserting === canvasState.mode &&
          LayerType.Note === canvasState.layerType,
      },
      {
        label: "Rectangle",
        icon: Square,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          }),
        isActive:
          CanvasMode.Inserting === canvasState.mode &&
          LayerType.Rectangle === canvasState.layerType,
      },
      {
        label: "Ellipse",
        icon: Circle,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          }),
        isActive:
          CanvasMode.Inserting === canvasState.mode &&
          LayerType.Ellipse === canvasState.layerType,
      },
      {
        label: "Pen",
        icon: Pencil,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Pencil,
          }),
        isActive: CanvasMode.Pencil === canvasState.mode,
      },
    ],
    [canvasState, setCanvasState],
  );

  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        {toolsSchema.map((tool) => (
          <ToolButton key={tool.label} {...tool} />
        ))}
      </div>
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 h-[400px] w-[50px]">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md h-[270px] w-[52px]" />
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md h-[96px] w-[52px]" />
    </div>
  );
};

export default Toolbar;
