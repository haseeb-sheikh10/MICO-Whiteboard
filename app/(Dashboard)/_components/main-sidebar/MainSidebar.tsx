import React from "react";
import CreateOrg from "./CreateOrg";
import OrgList from "./OrgList";

const MainSidebar = () => {
  return (
    <aside className="sticky left-0 z-10 h-screen bg-green-900 w-16 px-3 py-3 text-white">
      <OrgList />
      <CreateOrg />
    </aside>
  );
};

export default MainSidebar;
