import { create } from "zustand";
import type { UserProfile } from "../types";

interface AuthState {
  currentUser: UserProfile | null;
  following: Set<string>;
  setCurrentUser: (user: UserProfile | null) => void;
  setFollowing: (handles: string[]) => void;
  addFollowing: (handle: string) => void;
  removeFollowing: (handle: string) => void;
  isFollowing: (handle: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  following: new Set(),
  setCurrentUser: (user) => set({ currentUser: user }),
  setFollowing: (handles) => set({ following: new Set(handles) }),
  addFollowing: (handle) =>
    set((state) => ({ following: new Set([...state.following, handle]) })),
  removeFollowing: (handle) => {
    const next = new Set(get().following);
    next.delete(handle);
    set({ following: next });
  },
  isFollowing: (handle) => get().following.has(handle),
}));
