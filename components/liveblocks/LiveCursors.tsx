import { useOthers } from "@/liveblocks.config";
import React, { memo } from "react";
import Cursor from "./Cursor";
import { randomColor } from "@/lib/utils";

const LiveCursors = () => {
  const others = useOthers();

  return others.map(({ connectionId, presence, info }) => {
    if (presence?.cursor === null) {
      return null;
    }

    return (
      <Cursor
        key={`cursor-${connectionId}`}
        color={randomColor(connectionId)}
        x={presence?.cursor?.x}
        y={presence?.cursor?.y}
        name={info?.name}
      />
    );
  });
};

export default memo(LiveCursors);
