"use client";

import { UserButton } from "@clerk/clerk-react";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <nav className="px-5 py-1 mx-auto shadow-lg">
      <div className="flex justify-between items-center">
        <Image
          src="/logo.svg"
          width={200}
          height={100}
          alt="MICO Whiteboard Logo"
        />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
