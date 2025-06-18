import { create } from "zustand";

import { User } from "@/types/User";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),
}));
