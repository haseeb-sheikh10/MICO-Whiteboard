import { RectangleLayer } from "@/types/canvas";
import React, { PointerEvent } from "react";

interface RectangleLayerProps {
  id: string;
  layer: RectangleLayer;
  onLayerPointerDown: (
    e: PointerEvent<SVGRectElement>,
    layerId: string,
  ) => void;
  selectionColor?: string;
}

const Rectangle = ({
  id,
  layer,
  onLayerPointerDown,
  selectionColor,
}: RectangleLayerProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onLayerPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke={selectionColor || "transparent"}
    />
  );
};

export default Rectangle;
