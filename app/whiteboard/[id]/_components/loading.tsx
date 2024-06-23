import React from "react";
import { Loader } from "lucide-react";
import { InfoSkeleton } from "./Info";
import { ParticipantsSkeleton } from "./Participants";
import { ToolbarSkeleton } from "./Toolbar";

const Loading = () => {
  return (
    <main className="h-screen w-full relative bg-amber-50 touch-none flex items-center justify-center">
      <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};

export default Loading;
