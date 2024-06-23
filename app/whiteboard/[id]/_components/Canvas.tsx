"use client";

import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

const Canvas = ({ boardId }: { boardId: string }) => {
  return (
    <main className="h-screen w-full relative bg-primary-foreground touch-none">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};

export default Canvas;
