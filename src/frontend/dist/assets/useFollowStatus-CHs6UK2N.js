import { c as createLucideIcon, s as create, u as useQueryClient, a as useActor, b as useMutation, e as createActor } from "./index-CaylQVRx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
const useAuthStore = create((set, get) => ({
  currentUser: null,
  following: /* @__PURE__ */ new Set(),
  setCurrentUser: (user) => set({ currentUser: user }),
  setFollowing: (handles) => set({ following: new Set(handles) }),
  addFollowing: (handle) => set((state) => ({ following: /* @__PURE__ */ new Set([...state.following, handle]) })),
  removeFollowing: (handle) => {
    const next = new Set(get().following);
    next.delete(handle);
    set({ following: next });
  },
  isFollowing: (handle) => get().following.has(handle)
}));
function useFollowStatus(handle) {
  const isFollowing = useAuthStore((s) => s.isFollowing(handle));
  return { isFollowing };
}
function useFollow() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const addFollowing = useAuthStore((s) => s.addFollowing);
  const removeFollowing = useAuthStore((s) => s.removeFollowing);
  return useMutation({
    mutationFn: async ({
      handle,
      currentlyFollowing
    }) => {
      if (!actor) throw new Error("Not authenticated");
      if (currentlyFollowing) {
        removeFollowing(handle);
      } else {
        addFollowing(handle);
      }
      return { handle, newState: !currentlyFollowing };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["profile", vars.handle] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    }
  });
}
export {
  Heart as H,
  useFollow as a,
  useFollowStatus as u
};
