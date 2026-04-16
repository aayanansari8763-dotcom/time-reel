import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Video } from "../backend";
import { createActor } from "../backend";
import type { VideoInfo } from "../types";
import { SAMPLE_VIDEOS } from "./useSampleVideos";

// Map a backend Video (with ExternalBlob) to our frontend VideoInfo shape
function mapVideo(v: Video): VideoInfo {
  return {
    id: v.id,
    creatorHandle: v.uploaderHandle,
    creatorAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(v.uploaderHandle)}&backgroundColor=0a0a1a`,
    videoUrl: v.videoBlob.getDirectURL(),
    thumbnailUrl: v.thumbnailBlob.getDirectURL(),
    caption: v.title,
    hashtags: v.tags,
    soundName: `${v.category} Sound`,
    likeCount: Number(v.likeCount),
    commentCount: Number(v.commentCount),
    shareCount: Number(v.shareCount),
    viewCount: Number(v.viewCount),
    giftCount: Number(v.giftCount),
    isLiked: false,
    createdAt: Number(v.createdAt),
    duration: 0,
    isVerified: false,
  };
}

export function useVideoFeed() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VideoInfo[]>({
    queryKey: ["videos", "feed"],
    queryFn: async () => {
      if (!actor) return SAMPLE_VIDEOS;
      try {
        const videos = await actor.getVideos(null, null, BigInt(30));
        if (videos.length === 0) return SAMPLE_VIDEOS;
        return videos.map(mapVideo);
      } catch {
        return SAMPLE_VIDEOS;
      }
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useTrendingVideos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VideoInfo[]>({
    queryKey: ["videos", "trending"],
    queryFn: async () => {
      if (!actor)
        return [...SAMPLE_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
      try {
        const videos = await actor.getTrendingVideos(null, BigInt(50));
        if (videos.length === 0)
          return [...SAMPLE_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
        return videos.map(mapVideo);
      } catch {
        return [...SAMPLE_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
      }
    },
    enabled: !isFetching,
    staleTime: 60000,
  });
}

export function useLikeVideo() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      videoId,
      isLiked,
    }: { videoId: string; isLiked: boolean }) => {
      if (!actor) return;
      if (isLiked) {
        await actor.unlikeVideo(videoId);
        return { videoId, newLiked: false };
      }
      await actor.likeVideo(videoId);
      return { videoId, newLiked: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useIncrementView() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) return;
      await actor.incrementView(videoId);
    },
  });
}
