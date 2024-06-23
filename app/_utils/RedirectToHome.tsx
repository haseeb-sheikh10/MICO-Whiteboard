"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return null;
};

export default RedirectToHome;
