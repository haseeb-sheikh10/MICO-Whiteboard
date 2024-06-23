"use client";

import Hint from "@/components/Hint";
import { TabSeperator } from "@/components/TabSeperator";
import BoardActions from "@/components/actions/BoardActions";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/useRenameModal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Info = ({ boardId }: { boardId: string }) => {
  const { onOpen } = useRenameModal();
  const data = useQuery(api.boards.single, { id: boardId as Id<"boards"> });

  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-10 flex items-center shadow-md w-fit">
      <Hint label="Go to dashboard" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/dashboard">
            <Image src="/only_logo.svg" width={50} height={50} alt="LOGO" />
            <span className={cn("font-semibold text-xl ml-2")}>Board</span>
          </Link>
        </Button>
      </Hint>
      <TabSeperator />
      <Hint label="Edit Title" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeperator />
      <BoardActions sideOffset={10} id={data._id} title={data.title}>
        <Button variant="board" size="icon">
          <Menu />
        </Button>
      </BoardActions>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-10 flex items-center shadow-md w-[322px]" />
  );
};

export default Info;
