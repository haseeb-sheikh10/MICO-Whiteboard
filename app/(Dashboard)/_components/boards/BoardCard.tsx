import Overlay from "@/components/Overlay";
import BoardActions from "@/components/actions/BoardActions";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";

interface BoardCardProps {
  _id: string;
  title: string;
  authorId: string;
  authorName: string;
  isFavorite: boolean;
  orgId: string;
  imageUrl: string;
  _creationTime: number;
}

interface FooterProps {
  isFavorite: boolean;
  title: string;
  author: string;
  createdAt: string;
  onClick: (e: any) => void;
  disabled: boolean;
}

const Footer = ({
  isFavorite,
  title,
  author,
  createdAt,
  onClick,
  disabled,
}: FooterProps) => {
  return (
    <div className="relative p-3 bg-white">
      <p className="text-[13px] truncate max-w-[calc(100% - 20px)]">{title}</p>
      <p className="text-[11px] truncate opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
        {author} , {createdAt}
      </p>
      <button
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-amber-500 absolute top-3 right-3",
          {
            "cursor-not-allowed opacity-75": disabled,
          },
        )}
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        <Star
          className={cn("h-4 w-4", {
            "text-amber-500 fill-amber-500": isFavorite,
          })}
        />
      </button>
    </div>
  );
};

const BoardCard = (props: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === props.authorId ? "You" : props.authorName;
  const createdAt = formatDistanceToNow(props?._creationTime, {
    addSuffix: true,
  });

  const { mutate, pending } = useApiMutation(api.boards.favourite);

  const toggleFavorite = useCallback(
    (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (!props._id || !props.orgId) return;

      mutate({
        boardId: props._id,
        orgId: props.orgId,
      })
        .then((result: string) => {
          if (result === "added")
            toast.success(`${props?.title} is added to your favorites`);
          else if (result === "removed")
            toast.success(`${props?.title} is removed from your favorites`);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
    [props._id, props.orgId, mutate, props?.title],
  );

  return (
    <Link href={`/whiteboard/${props._id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden cursor-pointer">
        <div className="relative flex-1 bg-amber-50">
          {props?.imageUrl && (
            <Image
              src={props.imageUrl}
              alt={props.title}
              fill
              className="object-fit"
            />
          )}
          <Overlay />
          <BoardActions id={props?._id} title={props.title}>
            <MoreHorizontal className="text-white opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1" />
          </BoardActions>
        </div>
        <Footer
          isFavorite={props.isFavorite}
          title={props.title}
          author={authorLabel}
          createdAt={createdAt}
          onClick={toggleFavorite}
          disabled={pending}
        />
      </div>
    </Link>
  );
};

export default BoardCard;
