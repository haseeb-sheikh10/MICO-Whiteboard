import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import CreateOrg from "../../app/(Dashboard)/_components/main-sidebar/CreateOrg";

const EmptyFav = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image
        src="/illustrations/empty_fav.svg"
        width={250}
        height={250}
        alt="Empty Favorites illustration"
      />
      <h2 className="text-2xl font-semibold mt-6">No favorite boards!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try favoriting a board to see it here
      </p>
    </div>
  );
};

export default EmptyFav;
