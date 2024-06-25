import LiveCursors from "@/components/liveblocks/LiveCursors";
import React, { memo } from "react";

const CursorPresence = () => {
  return (
    <>
      <LiveCursors />
    </>
  );
};

export default memo(CursorPresence);
