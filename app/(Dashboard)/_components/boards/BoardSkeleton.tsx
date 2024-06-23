import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BoardSkeleton = () => {
  return (
    <div className="aspect-[100/127] flex flex-col justify-between space-y-3 overflow-hidden">
      <Skeleton className="w-full flex-1 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
};

export default BoardSkeleton;
