import { calculateFontSize, cn, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";
import { NoteLayer } from "@/types/canvas";
import { Kalam } from "next/font/google";
import { PointerEvent, useCallback } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface NoteLayerProps {
  id: string;
  layer: NoteLayer;
  onLayerPointerDown: (
    e: PointerEvent<SVGForeignObjectElement>,
    layerId: string,
  ) => void;
  selectionColor?: string;
}

const font = Kalam({
  subsets: ["latin"],
  weight: ["300", "400"],
});

const Note = ({
  id,
  layer,
  onLayerPointerDown,
  selectionColor,
}: NoteLayerProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateText = useMutation(({ storage }, text: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", text);
  }, []);

  const handleContentChange = useCallback(
    (e: ContentEditableEvent) => {
      updateText(e.target.value);
    },
    [updateText],
  );

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onLayerPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill
          ? `rgb(${fill.r}, ${fill.g}, ${fill.b})`
          : "#000000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        className={cn(
          "h-full w-full flex justify-center items-center text-center outline-none",
          font.className,
        )}
        html={value ?? "text"}
        onChange={handleContentChange}
        style={{
          color: getContrastingTextColor(fill),
          fontSize: calculateFontSize(width, height, 0.15),
        }}
      />
    </foreignObject>
  );
};

export default Note;
