"use client";

import Hint from "@/components/Hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import React from "react";

const CreateOrg = () => {
   return (
      <Dialog>
         <DialogTrigger asChild>
            <div className="aspect-square">
               <Hint label="Add Organization" side="right">
                  <a className="bg-white/25 h-full w-full rounded-md flex justify-center items-center opacity-60 hover:opacity-100 transition cursor-pointer">
                     <Plus className="text-white w-[50%] h-[50%]" />
                  </a>
               </Hint>
            </div>
         </DialogTrigger>
         <DialogContent className="bg-transparent p-0 border-none max-w-[480px]">
            <CreateOrganization appearance={{
               elements: {
                  rootBox: "w-full relative z-10",
                  cardBox: "w-full relative z-10",
               }
            }} />
         </DialogContent>
      </Dialog>
   );
};

export default CreateOrg;
