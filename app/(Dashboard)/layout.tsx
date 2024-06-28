"use client";

import React from "react";
import Navbar from "./_components/Navbar";
import MainSidebar from "./_components/main-sidebar/MainSidebar";
import OrgSidebar from "./_components/org-sidebar/OrgSidebar";
import { Authenticated, Unauthenticated } from "convex/react";
import { RedirectToSignIn } from "@clerk/clerk-react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        <main className="h-full flex">
          <MainSidebar />
          <section className="h-full w-full">
            <div className="flex h-full">
              <OrgSidebar />
              <div className="flex-1 h-screen">
                <Navbar />
                <div className="p-6 h-[calc(100%-60px)] bg-primary-foreground overflow-y-auto">
                  {children}
                </div>
              </div>
            </div>
          </section>
        </main>
      </Authenticated>
    </>
  );
};

export default layout;
