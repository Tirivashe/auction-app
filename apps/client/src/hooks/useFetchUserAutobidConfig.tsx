import { useQuery } from "@tanstack/react-query";
import { getUserAutobidConfig } from "../api/queries";
import { ServerError, TAutobidConfig } from "../types";

const useFetchUserAutobidConfig = (userId: string) => {
  return useQuery<TAutobidConfig, ServerError>({
    queryKey: ["config", userId],
    queryFn: () => getUserAutobidConfig(userId),
  });
};

export default useFetchUserAutobidConfig;
