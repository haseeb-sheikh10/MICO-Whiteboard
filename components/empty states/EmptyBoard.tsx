import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useOrganization } from "@clerk/clerk-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const EmptyBoard = () => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.boards.create);
  const { organization } = useOrganization();

  const handleCreate = useCallback(() => {
    if (!organization) return;
    mutate({
      title: "Untitled",
      orgId: organization.id,
    })
      .then((id) => {
        toast.success("Board created successfully");
        router.push(`/whiteboard/${id}`);
      })
      .catch((err) => toast.error("Failed to create board"));
  }, [organization, mutate, router]);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image
        src="/illustrations/empty_board.svg"
        width={250}
        height={250}
        alt="Empty Board illustration"
      />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button
          disabled={pending}
          size="lg"
          className="font-semibold"
          onClick={handleCreate}
        >
          Create Board
        </Button>
      </div>
    </div>
  );
};

export default EmptyBoard;
