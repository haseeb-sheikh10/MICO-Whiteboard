"use client";

import { useOrganization } from "@clerk/clerk-react";
import { lazy } from "react";
import EmptyOrg from "../../../components/empty states/EmptyOrg";
const BoardList = lazy(() => import("../_components/boards/BoardList"));
const Loader = lazy(() => import("@/components/Loader"));

interface DashboardProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const Dashboard = ({ searchParams }: DashboardProps) => {
  const { organization } = useOrganization();

  return (
    <div className="h-full">
      {!organization ? (
        <>
          <EmptyOrg />
        </>
      ) : (
        <BoardList orgId={organization?.id} query={searchParams} />
      )}
    </div>
  );
};

export default Dashboard;
