"use client";

import RenameModal from "@/components/modals/RenameModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
    return () => setmounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <RenameModal />
    </>
  );
};

export default ModalProvider;
