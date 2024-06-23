import { create } from "zustand";

const defaultValues = {
  id: "",
  title: "",
};

interface IRenameModal {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (id: string, title: string) => void;
  initialValues: typeof defaultValues;
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, initialValues: defaultValues }),
  onOpen: (id, title) => set({ isOpen: true, initialValues: { id, title } }),
  initialValues: defaultValues,
}));
