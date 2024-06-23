import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomColor = (connectionId: number) => {
  return COLORS[connectionId % COLORS.length];
};
