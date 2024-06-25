import { useSelf, useStorage } from "@/liveblocks.config";
import { Layers, XYWH } from "@/types/canvas";
import { shallow } from "@liveblocks/client";

const boundingBox = (layers: Layers[]): XYWH | null => {
  const first = layers[0];
  if (!first) return null;

  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;
  let left = first.x;

  for (let i = 0; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (top > y) {
      top = y;
    }

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }
    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBounds = () => {
  const selections = useSelf((me) => me.presence.selection);
  return useStorage((root) => {
    const layers = selections.map((id) => root.layers.get(id)!).filter(Boolean);
    return boundingBox(layers);
  }, shallow);
};
