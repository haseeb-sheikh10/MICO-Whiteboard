"use client";

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ShowSwitcher = () => {
  const params = useSearchParams();
  const favorites = params.get("favorites");
  return (
    <>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "max-w-[480px]",
            organizationSwitcherTrigger:
              "p-[6px] w-full flex-1 justify-between items-center rounded-[8px] border border-[#e5e7eb] bg-white",
          },
        }}
      />
      <div className="pt-5 gap-y-2 w-full flex flex-col">
        <Button
          asChild
          variant={favorites ? "ghost" : "secondary"}
          size="lg"
          className="justify-start items-center font-normal px-2 w-full"
        >
          <Link href="/home">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Team Boards
          </Link>
        </Button>
        <Button
          asChild
          variant={favorites ? "secondary" : "ghost"}
          size="lg"
          className="justify-start items-center font-normal px-2 w-full"
        >
          <Link
            href={{
              pathname: "/home",
              query: { favorites: true },
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Favorite Boards
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ShowSwitcher;
