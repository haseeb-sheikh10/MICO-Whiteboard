import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import React from "react";
import { ColorPicker } from "./ColorPicker";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
  scale: number;
}

const SelectionTools = ({
  camera,
  setLastUsedColor,
  scale,
}: SelectionToolsProps) => {
  const selections = useSelf((me) => me.presence.selection);

  const handleChangeShapeColor = useMutation(
    ({ storage }, color: Color) => {
      const layers = storage.get("layers");
      setLastUsedColor(color);

      for (const layerId of selections) {
        const layer = layers.get(layerId);
        if (layer) {
          layer.set("fill", color);
        }
      }
    },
    [selections],
  );

  const deleteLayers = useDeleteLayers();

  const selectionBounds = useSelectionBounds();

  if (!selections || !selectionBounds) return null;

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      style={{
        transform: `translate(
        calc(${x}px - 50%), 
        calc(${y - 16}px - 100%)
        )`,
      }}
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex items-center select-none"
    >
      <ColorPicker onChange={handleChangeShapeColor} />
      <Button
        size="icon"
        variant="ghost"
        className="text-red-500 hover:bg-red-50 hover:text-red-500"
        onClick={deleteLayers}
      >
        <Trash className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SelectionTools;
