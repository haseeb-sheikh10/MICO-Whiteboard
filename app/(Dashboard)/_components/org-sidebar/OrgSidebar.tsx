import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ShowSwitcher from "./ShowSwitcher";

const OrgSidebar = () => {
  return (
    <aside className="hidden md:flex h-screen flex-col w-60 px-5 py-3 border-r">
      <Link href="/">
        <div className="flex justify-center items-center gap-x-1">
          <Image src="/only_logo.svg" width={60} height={60} alt="LOGO" />
          <span className={cn("font-semibold text-2xl")}>Board</span>
        </div>
      </Link>
      <div className="flex flex-col justify-center items-center pt-5">
        <ShowSwitcher />
      </div>
    </aside>
  );
};

export default OrgSidebar;
