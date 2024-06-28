import Path from "@/app/whiteboard/[id]/_components/layers/Path";
import { useOthersMapped } from "@/liveblocks.config";
import { shallow } from "@liveblocks/client";

const LiveDrafts = () => {
  const drafts = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow,
  );

  return drafts.map(([key, other]) => {
    if (other.pencilDraft) {
      return (
        <Path
          key={key}
          x={0}
          y={0}
          points={other.pencilDraft}
          fill={other.penColor}
        />
      );
    }
  });
};

export default LiveDrafts;
