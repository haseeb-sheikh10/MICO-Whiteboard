"use client";

import SearchInput from "@/components/SearchInput";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/clerk-react";
import Image from "next/image";
import React from "react";
import InviteButton from "./InviteButton";

const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <nav className="px-5 py-2 border-b">
      <div className="flex justify-between gap-x-4 items-center">
        <div className="hidden md:block flex-1">
          <SearchInput />
        </div>
        <div className="block md:hidden flex-1">
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: "w-full max-w-[300px]",
                cardBox: "max-w-[300px]",
                organizationSwitcherTrigger:
                  "p-[6px] w-full flex-1 justify-between items-center rounded-md border border-[#e5e7eb] bg-white",
              },
            }}
          />
        </div>
        {organization && <InviteButton />}
        <UserButton
          appearance={{
            elements: {
              userButtonTrigger: "aspect-square",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
