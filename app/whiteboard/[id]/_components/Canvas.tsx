"use client";

import { useSelf } from "@/liveblocks.config";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

const Canvas = ({ boardId }: { boardId: string }) => {
  const info = useSelf((me) => me.info);

  console.log(info);

  return (
    <main className="h-screen w-full relative bg-amber-50 touch-none">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};

export default Canvas;
