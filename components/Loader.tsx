import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center absolute top-0 left-0 backdrop-blur-md z-50">
      <Image
        src="/gif/Skateboarding.gif"
        alt="MICO WHITEBOARD LOGO"
        width={100}
        height={100}
      />
    </div>
  );
};

export default Loader;
