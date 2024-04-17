import { useMutation } from "@tanstack/react-query";
import { deleteItem } from "../api/mutations";

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
  });
};
