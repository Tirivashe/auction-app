import { useMutation } from "@tanstack/react-query";
import { AuthorItemResponse, ServerError, UpdateItemDto } from "../types";
import { updateItem } from "../api/mutations";

export const useUpdateItem = (id: string) => {
  return useMutation<
    AuthorItemResponse | ServerError,
    ServerError,
    UpdateItemDto,
    unknown
  >({
    mutationFn: (body: UpdateItemDto) => updateItem(id, body),
  });
};
