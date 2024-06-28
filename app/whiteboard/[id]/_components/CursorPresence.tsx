import LiveCursors from "@/components/liveblocks/LiveCursors";
import LiveDrafts from "@/components/liveblocks/LiveDrafts";
import React, { memo } from "react";

const CursorPresence = () => {
  return (
    <>
      <LiveDrafts />
      <LiveCursors />
    </>
  );
};

export default memo(CursorPresence);
