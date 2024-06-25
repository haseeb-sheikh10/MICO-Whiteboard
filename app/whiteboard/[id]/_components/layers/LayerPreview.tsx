import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import React, { PointerEvent } from "react";
import Rectangle from "./Rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (
    e: PointerEvent<SVGRectElement>,
    layerId: string,
  ) => void;
  selectionColor?: string;
}

const LayerPreview = ({
  id,
  onLayerPointerDown,
  selectionColor,
}: LayerPreviewProps) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onLayerPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
  }
};

export default LayerPreview;
