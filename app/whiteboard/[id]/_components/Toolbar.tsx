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

const Toolbar = () => {
  const toolsSchema = useMemo(
    () => [
      {
        label: "Select",
        icon: MousePointer2,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
      {
        label: "Text",
        icon: Type,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
      {
        label: "Sticky Note",
        icon: StickyNote,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
      {
        label: "Rectangle",
        icon: Square,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
      {
        label: "Ellipse",
        icon: Circle,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
      {
        label: "Pen",
        icon: Pencil,
        onClick: () => {},
        iscActive: false,
        isDisabled: false,
      },
    ],
    [],
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
          onClick={() => {}}
          isDisabled={true}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={() => {}}
          isDisabled={true}
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
