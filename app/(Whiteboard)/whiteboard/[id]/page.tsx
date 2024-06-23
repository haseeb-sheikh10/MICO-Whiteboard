import React from "react";

interface WhiteboardProps {
  searchParam: {
    params: {
      id: string;
    };
  };
}

const Whiteboard = (searchParam: WhiteboardProps) => {
  return <div>pages: {JSON.stringify(searchParam.params.id)}</div>;
};

export default Whiteboard;
