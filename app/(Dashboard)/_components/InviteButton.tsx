"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/clerk-react";
import { Plus } from "lucide-react";

const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-x-2">
          <Plus className="w-4 h-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-transparent p-0 border-none max-w-[880px]">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full h-full",
              cardBox: "w-full h-full",
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteButton;
