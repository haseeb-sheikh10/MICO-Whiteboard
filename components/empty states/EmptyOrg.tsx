import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import CreateOrg from "../../app/(Dashboard)/_components/main-sidebar/CreateOrg";

const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image
        src="/illustrations/empty_state.svg"
        width={250}
        height={250}
        alt="Empty organization illustration"
      />
      <h2 className="text-2xl font-semibold mt-6">Welcome to MICO BOARD</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create or select an organization to get started
      </p>
      <div className="mt-6">
        <CreateOrg
          trigger={
            <Button size="lg" className="font-semibold">
              Create Organization
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EmptyOrg;
