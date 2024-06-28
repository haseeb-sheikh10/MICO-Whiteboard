import { useHistory } from "@/liveblocks.config";
import { useEffect } from "react";
import { useDeleteLayers } from "./useDeleteLayers";

export const useKeyEvent = () => {
  const history = useHistory();
  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete": {
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            history.undo();
            break;
          }
        }
        case "y": {
          if (e.ctrlKey || e.metaKey) {
            history.redo();
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [history, deleteLayers]);
};
