"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/useRenameModal";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2, Pencil, Trash } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import ConfirmationAlert from "../ConfirmationAlert";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BoardActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

const BoardActions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: BoardActionsProps) => {
  const { mutate, pending } = useApiMutation(api.boards.remove);
  const { onOpen } = useRenameModal();

  const handleDeleteBoard = useCallback(() => {
    if (!id) return;
    mutate({ id })
      .then(() => toast.success(`Board "${title}" deleted successfully`))
      .catch(() => toast.error("Failed to delete board"));
  }, [id, mutate, title]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${window.location.origin}/whiteboard/${id}`)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link to clipboard"));
  }, [id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-52"
      >
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="px-2 cursor-pointer"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="px-2 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmationAlert
          title="Are you absolutely sure?"
          body="This action cannot be undone. This will permanently delete your board
        and remove your data from our servers."
          onConfirm={handleDeleteBoard}
          disabled={pending}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "px-2 cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-500 text-sm w-full justify-start font-normal",
              {
                "opacity-75 cursor-not-allowed": pending,
              },
            )}
          >
            <Trash className="h-4 w-4 mr-2 text-red-500" />
            Delete board
          </Button>
        </ConfirmationAlert>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardActions;
