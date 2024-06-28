import { getSvgPathFromStroke } from "@/lib/utils";
import { Color, PathLayer } from "@/types/canvas";
import React from "react";
import getStroke from "perfect-freehand";

interface PathLayerProps {
  points: number[][];
  fill: Color | null;
  x: number;
  y: number;
  onPointerDown?: (e: any) => void;
  stroke?: string;
}

const Path = ({
  points,
  fill,
  x,
  y,
  onPointerDown,
  stroke,
}: PathLayerProps) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 14,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        }),
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill ? `rgb(${fill.r}, ${fill.g}, ${fill.b}` : "#000"}
      stroke={
        stroke ? stroke : fill ? `rgb(${fill.r}, ${fill.g}, ${fill.b}` : "#000"
      }
      strokeWidth={1}
    />
  );
};

export default Path;
