import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { useAuthStore } from "../store/auth";

export function useFollowStatus(handle: string) {
  const isFollowing = useAuthStore((s) => s.isFollowing(handle));
  return { isFollowing };
}

export function useFollow() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const addFollowing = useAuthStore((s) => s.addFollowing);
  const removeFollowing = useAuthStore((s) => s.removeFollowing);

  return useMutation({
    mutationFn: async ({
      handle,
      currentlyFollowing,
    }: {
      handle: string;
      currentlyFollowing: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      if (currentlyFollowing) {
        // await actor.unfollowUser(handle);
        removeFollowing(handle);
      } else {
        // await actor.followUser(handle);
        addFollowing(handle);
      }
      return { handle, newState: !currentlyFollowing };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["profile", vars.handle] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}
