import { useMutation } from "@tanstack/react-query";
import { toggleAutoBid } from "../api/mutations";

const useToggleAutoBid = (userId: string, itemId: string) => {
  return useMutation({
    mutationFn: () => toggleAutoBid(userId, itemId),
  });
};

export default useToggleAutoBid;
