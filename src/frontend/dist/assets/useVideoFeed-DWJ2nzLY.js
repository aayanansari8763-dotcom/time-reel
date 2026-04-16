import { a as useActor, d as useQuery, u as useQueryClient, b as useMutation, e as createActor } from "./index-CaylQVRx.js";
import { S as SAMPLE_VIDEOS } from "./useSampleVideos-wXi82xme.js";
function mapVideo(v) {
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
    isVerified: false
  };
}
function useVideoFeed() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
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
    staleTime: 3e4
  });
}
function useTrendingVideos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
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
    staleTime: 6e4
  });
}
function useLikeVideo() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      videoId,
      isLiked
    }) => {
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
    }
  });
}
export {
  useVideoFeed as a,
  useTrendingVideos as b,
  useLikeVideo as u
};
