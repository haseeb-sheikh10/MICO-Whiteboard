import { Color } from "@/types/canvas";
import { colorPalette } from "./color-palletes";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1 max-w-[164px] pr-2 mr-2 border-nuetral-200">
      {colorPalette.map((color, index) => (
        <ColorButton key={index} color={color} onClick={onChange} />
      ))}
    </div>
  );
};

interface ColorButtonProps {
  color: Color;
  onClick: (color: Color) => void;
}

export const ColorButton = ({ color, onClick }: ColorButtonProps) => {
  return (
    <button
      className="w-6 h-6 items-center justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="w-6 h-6 rounded-full border border-neutral-300"
        style={{
          background: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      ></div>
    </button>
  );
};
