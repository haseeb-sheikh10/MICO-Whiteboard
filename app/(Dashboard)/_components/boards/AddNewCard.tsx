"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

interface AddNewCardProps {
  orgId: string;
  disabled?: boolean;
}

const AddNewCard = ({ orgId, disabled }: AddNewCardProps) => {
  const router = useRouter();

  const { mutate, pending } = useApiMutation(api.boards.create);

  const handleCreate = useCallback(() => {
    if (!orgId) return;
    mutate({
      title: "Untitled",
      orgId: orgId,
    })
      .then((id) => {
        toast.success("Board created successfully");
        router.push(`/whiteboard/${id}`);
      })
      .catch((err) => toast.error("Failed to create board"));
  }, [orgId, mutate, router]);

  return (
    <button
      disabled={disabled || pending}
      onClick={handleCreate}
      className={cn(
        "col-span-1 aspect-[100/127] bg-primary rounded-lg hover:bg-amber-300 transition flex flex-col items-center justify-center py-6",
        {
          "opacity-75 cursor-not-allowed": disabled || pending,
        },
      )}
    >
      <div />
      <Plus className="w-12 h-12 text-white stroke-1" />
      <p className="text-xs text-white font-light">New Board</p>
    </button>
  );
};

export default AddNewCard;
