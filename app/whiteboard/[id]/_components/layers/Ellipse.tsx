import { EllipseLayer } from "@/types/canvas";
import React, { PointerEvent } from "react";

interface EllipseLayerProps {
  id: string;
  layer: EllipseLayer;
  onLayerPointerDown: (
    e: PointerEvent<SVGEllipseElement>,
    layerId: string,
  ) => void;
  selectionColor?: string;
}

const Ellipse = ({
  id,
  layer,
  onLayerPointerDown,
  selectionColor,
}: EllipseLayerProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onLayerPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke={selectionColor || "transparent"}
    />
  );
};

export default Ellipse;
