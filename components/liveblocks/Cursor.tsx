import { MousePointer2 } from "lucide-react";
import React, { memo } from "react";

type Props = {
  color: string;
  x: number;
  y: number;
  name?: string;
};

const Cursor = ({ color, x, y, name = "Teammate" }: Props) => {
  return (
    <foreignObject
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      height="50"
      width={name?.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: color,
          color: color,
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs font-semibold text-white"
        style={{
          backgroundColor: color,
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
};

export default memo(Cursor);
