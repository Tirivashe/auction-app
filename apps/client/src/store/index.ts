import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ServerAuthSuccessResponse, User } from "../types";

type State = {
  token: string | null;
  user: User | null;
  setAuthResponse: (authResponse: ServerAuthSuccessResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<State, [["zustand/persist", State]]>(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuthResponse: (authResponse: ServerAuthSuccessResponse) => {
        set({ token: authResponse.token, user: authResponse.user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
