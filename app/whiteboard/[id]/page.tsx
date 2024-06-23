import React from "react";
import Canvas from "./_components/Canvas";
import { Room } from "@/components/liveblocks/Room";
import Loading from "./_components/loading";

interface WhiteboardProps {
  params: {
    id: string;
  };
}

const Whiteboard = ({ params }: WhiteboardProps) => {
  return (
    <Room roomId={params?.id} fallback={<Loading />}>
      <Canvas boardId={params?.id} />
    </Room>
  );
};

export default Whiteboard;
