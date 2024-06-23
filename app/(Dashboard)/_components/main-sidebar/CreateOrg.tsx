"use client";

import Hint from "@/components/Hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import React from "react";

const CreateOrg = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-transparent p-0 border-none max-w-[480px]">
        <CreateOrganization
          appearance={{
            elements: {
              rootBox: "w-full relative z-10",
              cardBox: "w-full relative z-10",
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrg;
