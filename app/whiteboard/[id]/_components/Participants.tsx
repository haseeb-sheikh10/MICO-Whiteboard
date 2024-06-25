"use client";

import { randomColor } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";
import { useMemo } from "react";
import UserAvatar from "./UserAvatar";

const MAX_SHOWN_USERS = 2;

const Participants = () => {
  const self = useSelf();
  const others = useOthers();
  const hasMoreUsers = useMemo(() => others.length > MAX_SHOWN_USERS, [others]);

  if (!self && !others.length) {
    return <ParticipantsSkeleton />;
  }

  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 h-10 flex items-center shadow-md w-fit">
      <div className="flex gap-x-2">
        {self && (
          <UserAvatar
            name={"You"}
            src={self?.info?.picture}
            borderColor={randomColor(self.connectionId)}
          />
        )}
        {others
          ?.slice(0, MAX_SHOWN_USERS)
          .map(({ connectionId, info }) => (
            <UserAvatar
              key={connectionId}
              name={info?.name}
              src={info?.picture}
              fallback={info?.name?.[0]}
              borderColor={randomColor(connectionId)}
            />
          ))}
        {hasMoreUsers && (
          <UserAvatar
            name={`${others.length - MAX_SHOWN_USERS} more`}
            fallback={`+${others.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 h-10 flex items-center shadow-md w-[100px]" />
  );
};

export default Participants;
