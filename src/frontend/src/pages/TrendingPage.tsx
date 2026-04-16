import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BadgeCheck, Eye, Flame, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Skeleton } from "../components/LoadingSkeleton";
import { useSampleTrendingVideos } from "../hooks/useSampleVideos";
import { useTrendingVideos } from "../hooks/useVideoFeed";
import type { VideoInfo } from "../types";

// ─── Types & Constants ────────────────────────────────────────────────────────

type Category =
  | "All"
  | "Music"
  | "Comedy"
  | "Dance"
  | "Food"
  | "Travel"
  | "Sports"
  | "Tech";

const CATEGORIES: Category[] = [
  "All",
  "Music",
  "Comedy",
  "Dance",
  "Food",
  "Travel",
  "Sports",
  "Tech",
];

const CATEGORY_HASHTAGS: Record<Exclude<Category, "All">, string[]> = {
  Music: ["aimusic", "neuralbeats", "synthwave"],
  Comedy: ["lol", "funny", "comedy"],
  Dance: ["futuredance", "aigenerated", "choreography"],
  Food: ["foodporn", "neonkitchen", "techcooking"],
  Travel: ["cyberpunkcity", "futuretravel", "explore"],
  Sports: ["futureskate", "extremart", "extremexp"],
  Tech: ["futuretech", "aimusic", "digitalpet"],
};

const RANK_STYLES: Record<number, { badge: string; label: string }> = {
  1: {
    badge:
      "bg-[oklch(0.78_0.18_68)] text-[oklch(0.12_0_0)] shadow-[0_0_8px_oklch(0.78_0.18_68/0.6)]",
    label: "#1",
  },
  2: {
    badge: "bg-[oklch(0.74_0.02_0)] text-[oklch(0.12_0_0)]",
    label: "#2",
  },
  3: {
    badge: "bg-[oklch(0.57_0.12_50)] text-[oklch(0.97_0_0)]",
    label: "#3",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function computeTrendingScore(video: VideoInfo): number {
  const hoursOld = (Date.now() - video.createdAt) / 3_600_000;
  const decay = Math.exp(-0.05 * hoursOld);
  return Math.round(
    (video.viewCount * 0.3 + video.likeCount * 0.4 + video.shareCount * 0.3) *
      decay,
  );
}

function filterByCategory(
  videos: VideoInfo[],
  category: Category,
): VideoInfo[] {
  if (category === "All") return videos;
  const tags = CATEGORY_HASHTAGS[category as Exclude<Category, "All">];
  return videos.filter((v) =>
    v.hashtags.some((h) => tags.includes(h.toLowerCase())),
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: Category;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`trending.category_filter.${label.toLowerCase()}`}
      className={cn(
        "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition-smooth border",
        active
          ? "bg-[oklch(0.65_0.25_195)] text-[oklch(0.08_0_0)] border-[oklch(0.65_0.25_195)] shadow-[0_0_12px_oklch(0.65_0.25_195/0.45)]"
          : "bg-card/60 text-muted-foreground border-border/60 hover:border-[oklch(0.65_0.25_195/0.5)] hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function TrendingGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`sk-${
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            i
          }`}
          className="flex flex-col gap-2"
          data-ocid={`trending.loading_state.${i + 1}`}
        >
          <Skeleton className="aspect-[9/16] rounded-xl" />
          <div className="px-0.5 space-y-1.5">
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-1/2 h-2.5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendingGridCard({
  video,
  rank,
  index,
  onNavigate,
}: {
  video: VideoInfo;
  rank: number;
  index: number;
  onNavigate: (id: string) => void;
}) {
  const score = computeTrendingScore(video);
  const rankStyle = RANK_STYLES[rank];

  return (
    <motion.button
      type="button"
      onClick={() => onNavigate(video.id)}
      data-ocid={`trending.video_card.item.${index + 1}`}
      className="text-left flex flex-col gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.25_195)] focus-visible:rounded-xl"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-card border border-border/40">
        <img
          src={video.thumbnailUrl}
          alt={video.caption}
          className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" />

        {/* Play icon (hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Rank badge — top 3 only */}
        {rankStyle && (
          <div
            className={cn(
              "absolute top-2 left-2 min-w-[26px] h-[26px] px-1.5 rounded-full flex items-center justify-center text-[9px] font-display font-black shadow-lg",
              rankStyle.badge,
            )}
            aria-label={`Trending rank ${rank}`}
          >
            {rankStyle.label}
          </div>
        )}

        {/* View count — bottom left */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white/90 font-display font-semibold drop-shadow">
          <Eye className="w-3 h-3" />
          <span>{formatCount(video.viewCount)}</span>
        </div>

        {/* Like count — bottom right */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 text-[10px] text-white/90 font-display font-semibold drop-shadow">
          <span className="text-[11px] leading-none">♥</span>
          <span>{formatCount(video.likeCount)}</span>
        </div>
      </div>

      {/* Below-thumbnail info */}
      <div className="px-0.5 flex flex-col gap-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-xs font-display font-semibold text-foreground truncate min-w-0">
            @{video.creatorHandle}
          </span>
          {video.isVerified && (
            <BadgeCheck className="w-3 h-3 text-[oklch(0.65_0.25_195)] flex-shrink-0" />
          )}
        </div>

        {/* Trending score */}
        <div className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-[oklch(0.72_0.18_40)] flex-shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground">
            {formatCount(score)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function EmptyState() {
  return (
    <motion.div
      data-ocid="trending.empty_state"
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-5xl mb-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 2.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        🔥
      </motion.div>
      <p className="font-display font-bold text-lg text-foreground mb-2">
        No trending content yet
      </p>
      <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
        Be the first to go viral — upload something now and watch the momentum
        build.
      </p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrendingPage() {
  const search = useSearch({ strict: false }) as { category?: string };
  const navigate = useNavigate();

  const activeCategory: Category =
    (CATEGORIES.find((c) => c === search.category) as Category | undefined) ??
    "All";

  const setCategory = (cat: Category) => {
    navigate({
      to: "/trending",
      search: cat === "All" ? {} : { category: cat },
      replace: true,
    } as Parameters<typeof navigate>[0]);
  };

  // Merge sample + backend data
  const sampleVideos = useSampleTrendingVideos();
  const { data: backendVideos, isLoading } = useTrendingVideos();
  const videos = backendVideos ?? sampleVideos;

  // Sort by trending score (velocity × time-decay)
  const sorted = [...videos].sort(
    (a, b) => computeTrendingScore(b) - computeTrendingScore(a),
  );
  const filtered = filterByCategory(sorted, activeCategory);

  // Navigate to feed (full app would pass video ID for deep-link scroll)
  const handleNavigate = (_id: string) => {
    navigate({ to: "/feed" });
  };

  // 300ms minimum skeleton display
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(t);
    }
    setShowSkeleton(true);
    return undefined;
  }, [isLoading]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="trending.page"
    >
      {/* ── Sticky Header ───────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border/50"
        data-ocid="trending.header"
      >
        {/* Title row */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <span className="text-2xl" aria-hidden="true">
            🔥
          </span>
          <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
            Trending
          </h1>
          <div className="ml-auto flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[oklch(0.72_0.18_40)]" />
            <span className="text-xs font-mono text-muted-foreground">
              {filtered.length} videos
            </span>
          </div>
        </div>

        {/* Category filter chips — horizontal scroll */}
        <div
          className="flex gap-2 px-4 pb-3 overflow-x-auto"
          data-ocid="trending.category_filter_bar"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Grid Content ────────────────────────────────────────── */}
      <div className="flex-1 py-3">
        <AnimatePresence mode="wait">
          {showSkeleton ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TrendingGridSkeleton />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3"
              data-ocid="trending.video_grid"
            >
              {filtered.map((video, i) => (
                <TrendingGridCard
                  key={video.id}
                  video={video}
                  rank={i + 1}
                  index={i}
                  onNavigate={handleNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
