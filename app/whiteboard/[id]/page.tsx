import React from "react";
import Canvas from "./_components/Canvas";

interface WhiteboardProps {
  params: {
    id: string;
  };
}

const Whiteboard = ({ params }: WhiteboardProps) => {
  return <Canvas boardId={params.id} />;
};

export default Whiteboard;
