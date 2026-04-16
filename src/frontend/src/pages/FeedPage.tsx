import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VideoCardSkeleton } from "../components/LoadingSkeleton";
import { VideoCard } from "../components/VideoCard";
import { SAMPLE_VIDEOS } from "../hooks/useSampleVideos";
import { useVideoFeed } from "../hooks/useVideoFeed";
import type { VideoInfo } from "../types";

const CATEGORIES = [
  "For You",
  "Trending",
  "Latest",
  "Dance",
  "Food",
  "Gaming",
  "Art",
  "Fitness",
];

export default function FeedPage() {
  const { data: backendVideos, isLoading } = useVideoFeed();
  const [activeCategory, setActiveCategory] = useState("For You");
  const [videos, setVideos] = useState<VideoInfo[]>(SAMPLE_VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Once backend data loads, use it
  useEffect(() => {
    if (backendVideos && backendVideos.length > 0) {
      setVideos(backendVideos);
    }
  }, [backendVideos]);

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Load more at end of feed
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // Simulate loading more — in production calls next page from backend
    setTimeout(() => {
      setVideos((prev) => [
        ...prev,
        ...SAMPLE_VIDEOS.map((v) => ({
          ...v,
          id: `${v.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        })),
      ]);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore]);

  // Detect when last card is active to load more
  useEffect(() => {
    if (videos.length > 0 && activeIndex >= videos.length - 2) {
      handleLoadMore();
    }
  }, [activeIndex, videos.length, handleLoadMore]);

  if (isLoading && (!videos || videos.length === 0)) {
    return (
      <div
        className="h-[100dvh] overflow-hidden bg-[oklch(0.05_0_0)]"
        aria-label="Loading feed"
      >
        {[0, 1, 2].map((i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[oklch(0.05_0_0)]">
      {/* Category chips — fixed overlay at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 pt-safe"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ paddingTop: "env(safe-area-inset-top, 8px)" }}
      >
        <div
          className="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-none"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          data-ocid="feed.category_bar"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              data-ocid={`feed.category.${cat.toLowerCase().replace(/\s+/g, "_")}`}
              className={[
                "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-smooth whitespace-nowrap",
                activeCategory === cat
                  ? "bg-[oklch(0.72_0.2_200)] text-[oklch(0.05_0_0)] shadow-[0_0_12px_oklch(0.72_0.2_200/0.5)]"
                  : "bg-black/40 text-white/80 backdrop-blur-sm border border-white/10 hover:border-white/30",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Feed scroll container */}
      <div
        ref={containerRef}
        className="h-[100dvh] overflow-y-scroll"
        style={{
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        data-ocid="feed.page"
      >
        <AnimatePresence initial={false}>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onBecameActive={handleActiveChange}
              containerRef={containerRef}
            />
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="h-[100dvh] snap-start flex-shrink-0 flex items-center justify-center bg-[oklch(0.05_0_0)]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[oklch(0.72_0.2_200)] border-t-transparent rounded-full animate-spin" />
              <span className="text-white/60 text-sm font-body">
                Loading more...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Side progress bar */}
      <div className="absolute right-0.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 py-4">
        {videos.slice(0, Math.min(videos.length, 8)).map((video, i) => (
          <div
            key={video.id}
            className={[
              "w-1 rounded-full transition-all duration-300",
              i === activeIndex % Math.min(videos.length, 8)
                ? "h-5 bg-[oklch(0.72_0.2_200)]"
                : "h-1.5 bg-white/20",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
