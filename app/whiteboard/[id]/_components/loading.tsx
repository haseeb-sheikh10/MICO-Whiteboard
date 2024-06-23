import React from "react";
import { Loader } from "lucide-react";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

const Loading = () => {
  return (
    <main className="h-screen w-full relative bg-amber-50 touch-none flex items-center justify-center">
      <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};

export default Loading;
