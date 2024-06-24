"use client";

import { useCanRedo, useCanUndo, useHistory } from "@/liveblocks.config";
import { CanvasMode, CanvasState } from "@/types/canvas";
import { useState } from "react";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

const Canvas = ({ boardId }: { boardId: string }) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <main className="h-screen w-full relative bg-amber-50 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
    </main>
  );
};

export default Canvas;
