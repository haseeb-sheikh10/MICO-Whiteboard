import React from "react";
import CreateOrg from "./CreateOrg";
import OrgList from "./OrgList";
import Hint from "@/components/Hint";
import { Plus } from "lucide-react";

const MainSidebar = () => {
  return (
    <aside className="h-screen bg-amber-50 w-16 px-3 py-3 text-white">
      <OrgList />
      <CreateOrg
        trigger={
          <div className="aspect-square">
            <Hint label="Add Organization" side="right">
              <a className="bg-black/25 h-full w-full rounded-md flex justify-center items-center opacity-80 hover:opacity-100 transition cursor-pointer">
                <Plus className="text-white font-bold w-[50%] h-[50%]" />
              </a>
            </Hint>
          </div>
        }
      />
    </aside>
  );
};

export default MainSidebar;
