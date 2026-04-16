import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserProfile } from "../types";

const SAMPLE_PROFILES: Record<string, UserProfile> = {
  NeonSkate_Luna: {
    handle: "NeonSkate_Luna",
    displayName: "Luna Nakamura",
    avatarUrl:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=0a0a1a",
    bio: "Skater · Cyberpunk · Content creator from Neo Tokyo. Flowing through the future one trick at a time 🛹⚡",
    followerCount: 4200000,
    followingCount: 312,
    videoCount: 187,
    totalLikes: 28000000,
    isVerified: true,
    coinBalance: 45200n,
    joinedAt: Date.now() - 86400000 * 365,
  },
  CyberDance_Zara: {
    handle: "CyberDance_Zara",
    displayName: "Zara Okonkwo",
    avatarUrl:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Zara&backgroundColor=0a0a1a",
    bio: "AI choreographer · Blending human movement with neural rhythms 🤖💃 Let's dance into tomorrow",
    followerCount: 2800000,
    followingCount: 489,
    videoCount: 94,
    totalLikes: 15600000,
    isVerified: true,
    coinBalance: 28700n,
    joinedAt: Date.now() - 86400000 * 210,
  },
};

const DEFAULT_PROFILE: UserProfile = {
  handle: "user",
  displayName: "New Creator",
  avatarUrl:
    "https://api.dicebear.com/9.x/avataaars/svg?seed=default&backgroundColor=0a0a1a",
  bio: "New to Time Reel. Creating the future, one reel at a time.",
  followerCount: 0,
  followingCount: 0,
  videoCount: 0,
  totalLikes: 0,
  isVerified: false,
  coinBalance: 0n,
  joinedAt: Date.now(),
};

export function useProfile(handle: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile>({
    queryKey: ["profile", handle],
    queryFn: async () => {
      if (!actor)
        return SAMPLE_PROFILES[handle] ?? { ...DEFAULT_PROFILE, handle };
      try {
        return SAMPLE_PROFILES[handle] ?? { ...DEFAULT_PROFILE, handle };
      } catch {
        return SAMPLE_PROFILES[handle] ?? { ...DEFAULT_PROFILE, handle };
      }
    },
    enabled: !!handle && !isFetching,
    staleTime: 60000,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile | null>({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        // const result = await actor.getMyProfile();
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      if (!actor) throw new Error("Not authenticated");
      // await actor.saveCallerUserProfile(profile);
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}
