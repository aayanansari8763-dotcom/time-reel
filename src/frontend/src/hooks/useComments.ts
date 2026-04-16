import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { GiftType } from "../backend";
import type { CommentWithContext } from "../backend";
import type { Comment } from "../types";

/** Map a backend CommentWithContext record to the frontend Comment interface.
 *  Backend timestamps are nanoseconds (bigint) — convert to ms numbers. */
function mapComment(c: CommentWithContext): Comment {
  return {
    id: c.id,
    videoId: c.videoId,
    authorHandle: c.authorHandle,
    authorAvatar: c.authorAvatar || undefined,
    text: c.text,
    likeCount: Number(c.likeCount),
    isLiked: c.isLiked,
    createdAt: Number(c.createdAt / 1_000_000n), // nanoseconds → milliseconds
  };
}

export function useComments(videoId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Comment[]>({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getComments(videoId);
      return raw.map(mapComment);
    },
    enabled: !!videoId && !isFetching,
    staleTime: 30000,
  });
}

export function useAddComment(videoId: string) {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Not authenticated");
      const raw = await actor.addComment(videoId, text);
      return mapComment(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}

export function useDeleteComment(videoId: string) {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.deleteComment(videoId, commentId);
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}

export function useSendGift() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      videoId,
      giftId,
    }: { videoId: string; giftId: string }) => {
      if (!actor) throw new Error("Not authenticated");
      // Map the giftId string to the GiftType enum; fall back to heart if unknown
      const giftType =
        GiftType[giftId as keyof typeof GiftType] ?? GiftType.heart;
      await actor.sendGift(videoId, giftType);
      return { videoId, giftId };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["videos", vars.videoId] });
    },
  });
}

/**
 * Toggles a comment like in optimistic local state.
 * The backend doesn't expose likeComment / unlikeComment yet.
 * This hook is a UI-layer stub; it will be wired to real actor calls
 * once the backend exposes those methods.
 */
export function useToggleCommentLike() {
  return useMutation({
    mutationFn: async (commentId: string) => {
      // No backend call yet — optimistic UI is handled in CommentDrawer
      return commentId;
    },
  });
}
