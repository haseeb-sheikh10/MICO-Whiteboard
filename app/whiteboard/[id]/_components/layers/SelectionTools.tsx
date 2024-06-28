import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import { BringToFront, SendToBack, Trash } from "lucide-react";
import { ColorPicker } from "./ColorPicker";

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

  const moveToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];

      const arr = liveLayerIds.toImmutable();

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        liveLayerIds.move(
          indices[i],
          arr.length - 1 - (indices.length - 1 - i),
        );
      }
    },
    [selections],
  );

  const moveToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];

      const arr = liveLayerIds.toImmutable();

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayerIds.move(indices[i], i);
      }
    },
    [selections],
  );

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
      <div className="flex flex-col items-center gap-y-0.5">
        <Hint label="Bring to front">
          <Button variant="board" size="icon" onClick={moveToFront}>
            <BringToFront className="w-5 h-5" />
          </Button>
        </Hint>
        <Hint label="send to back" side="bottom">
          <Button variant="board" size="icon" onClick={moveToBack}>
            <SendToBack className="w-5 h-5" />
          </Button>
        </Hint>
      </div>
      <Hint label="Delete">
        <Button
          size="icon"
          variant="ghost"
          className="text-red-500 hover:bg-red-50 hover:text-red-500"
          onClick={deleteLayers}
        >
          <Trash className="w-6 h-6" />
        </Button>
      </Hint>
    </div>
  );
};

export default SelectionTools;
