import { useMutation } from "@tanstack/react-query";
import { ServerError } from "../types";
import { setUserAutobidConfig } from "../api/mutations";

const useSetUserAutobidConfig = (
  userId: string,
  maxBidAmount: number,
  autoBidPercentage: number
) => {
  return useMutation<void, ServerError>({
    mutationFn: () =>
      setUserAutobidConfig(userId, maxBidAmount, autoBidPercentage),
  });
};

export default useSetUserAutobidConfig;
