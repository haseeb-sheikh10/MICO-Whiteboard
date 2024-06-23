import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

export const useApiMutation = (mutationFunc: any) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunc);

  const mutate = useCallback(
    (payload: any) => {
      setPending(true);
      return apiMutation(payload)
        .finally(() => {
          setPending(false);
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    [apiMutation],
  );

  return { mutate, pending };
};
