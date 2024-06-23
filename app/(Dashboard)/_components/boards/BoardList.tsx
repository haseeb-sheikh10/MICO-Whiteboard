"use client";

import EmptyBoard from "@/components/empty states/EmptyBoard";
import EmptyFav from "@/components/empty states/EmptyFav";
import EmptySearch from "@/components/empty states/EmptySearch";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import BoardCard from "./BoardCard";
import BoardSkeleton from "./BoardSkeleton";
import AddNewCard from "./AddNewCard";
import { useCallback } from "react";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, { orgId, ...query });

  const renderCards = useCallback(() => {
    if (data === undefined) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((board) => (
        <BoardSkeleton key={board} />
      ));
    }

    return data?.map((board) => <BoardCard key={board?._id} {...board} />);
  }, [data]);

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFav />;
  }

  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <section>
      <h2 className="text-3xl font-semibold">
        {query.favorites ? "Favourite Boards" : "Team Boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-6">
        <AddNewCard orgId={orgId} />
        {renderCards()}
      </div>
    </section>
  );
};

export default BoardList;
