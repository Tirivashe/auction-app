import { useMutation } from "@tanstack/react-query";
import { ServerAuthSuccessResponse, ServerError, SignUpDto } from "../types";
import { signUp } from "../api/mutations";

export const useSignUp = () => {
  return useMutation<
    ServerAuthSuccessResponse | ServerError,
    ServerError,
    SignUpDto,
    unknown
  >({
    mutationFn: (signUpDto: SignUpDto) => signUp(signUpDto),
  });
};
