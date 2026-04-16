import { c as createLucideIcon, k as useSearch, l as useNavigate, r as reactExports, j as jsxRuntimeExports, g as cn, S as Skeleton } from "./index-CaylQVRx.js";
import { u as useSampleTrendingVideos, B as BadgeCheck } from "./useSampleVideos-wXi82xme.js";
import { b as useTrendingVideos } from "./useVideoFeed-DWJ2nzLY.js";
import { A as AnimatePresence } from "./index-xJDs66J8.js";
import { m as motion } from "./proxy-CAbfz4UL.js";
import { P as Play } from "./play-Ddxu0bLC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
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
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode);
const CATEGORIES = [
  "All",
  "Music",
  "Comedy",
  "Dance",
  "Food",
  "Travel",
  "Sports",
  "Tech"
];
const CATEGORY_HASHTAGS = {
  Music: ["aimusic", "neuralbeats", "synthwave"],
  Comedy: ["lol", "funny", "comedy"],
  Dance: ["futuredance", "aigenerated", "choreography"],
  Food: ["foodporn", "neonkitchen", "techcooking"],
  Travel: ["cyberpunkcity", "futuretravel", "explore"],
  Sports: ["futureskate", "extremart", "extremexp"],
  Tech: ["futuretech", "aimusic", "digitalpet"]
};
const RANK_STYLES = {
  1: {
    badge: "bg-[oklch(0.78_0.18_68)] text-[oklch(0.12_0_0)] shadow-[0_0_8px_oklch(0.78_0.18_68/0.6)]",
    label: "#1"
  },
  2: {
    badge: "bg-[oklch(0.74_0.02_0)] text-[oklch(0.12_0_0)]",
    label: "#2"
  },
  3: {
    badge: "bg-[oklch(0.57_0.12_50)] text-[oklch(0.97_0_0)]",
    label: "#3"
  }
};
function formatCount(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}
function computeTrendingScore(video) {
  const hoursOld = (Date.now() - video.createdAt) / 36e5;
  const decay = Math.exp(-0.05 * hoursOld);
  return Math.round(
    (video.viewCount * 0.3 + video.likeCount * 0.4 + video.shareCount * 0.3) * decay
  );
}
function filterByCategory(videos, category) {
  if (category === "All") return videos;
  const tags = CATEGORY_HASHTAGS[category];
  return videos.filter(
    (v) => v.hashtags.some((h) => tags.includes(h.toLowerCase()))
  );
}
function CategoryChip({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `trending.category_filter.${label.toLowerCase()}`,
      className: cn(
        "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition-smooth border",
        active ? "bg-[oklch(0.65_0.25_195)] text-[oklch(0.08_0_0)] border-[oklch(0.65_0.25_195)] shadow-[0_0_12px_oklch(0.65_0.25_195/0.45)]" : "bg-card/60 text-muted-foreground border-border/60 hover:border-[oklch(0.65_0.25_195/0.5)] hover:text-foreground"
      ),
      children: label
    }
  );
}
function TrendingGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 px-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-2",
      "data-ocid": `trending.loading_state.${i + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[9/16] rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-0.5 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-3/4 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-1/2 h-2.5" })
        ] })
      ]
    },
    `sk-${// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
    i}`
  )) });
}
function TrendingGridCard({
  video,
  rank,
  index,
  onNavigate
}) {
  const score = computeTrendingScore(video);
  const rankStyle = RANK_STYLES[rank];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      onClick: () => onNavigate(video.id),
      "data-ocid": `trending.video_card.item.${index + 1}`,
      className: "text-left flex flex-col gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.25_195)] focus-visible:rounded-xl",
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.045, duration: 0.3, ease: "easeOut" },
      whileTap: { scale: 0.97 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-card border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: video.thumbnailUrl,
              alt: video.caption,
              className: "absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4.5 h-4.5 text-white fill-white ml-0.5" }) }) }),
          rankStyle && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "absolute top-2 left-2 min-w-[26px] h-[26px] px-1.5 rounded-full flex items-center justify-center text-[9px] font-display font-black shadow-lg",
                rankStyle.badge
              ),
              "aria-label": `Trending rank ${rank}`,
              children: rankStyle.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white/90 font-display font-semibold drop-shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount(video.viewCount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 flex items-center gap-0.5 text-[10px] text-white/90 font-display font-semibold drop-shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] leading-none", children: "♥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount(video.likeCount) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-0.5 flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display font-semibold text-foreground truncate min-w-0", children: [
              "@",
              video.creatorHandle
            ] }),
            video.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "w-3 h-3 text-[oklch(0.65_0.25_195)] flex-shrink-0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3 text-[oklch(0.72_0.18_40)] flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground", children: formatCount(score) })
          ] })
        ] })
      ]
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": "trending.empty_state",
      className: "flex flex-col items-center justify-center py-20 px-6 text-center",
      initial: { opacity: 0, scale: 0.93 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "text-5xl mb-4",
            animate: { scale: [1, 1.1, 1] },
            transition: {
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            },
            "aria-hidden": "true",
            children: "🔥"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-2", children: "No trending content yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[220px] leading-relaxed", children: "Be the first to go viral — upload something now and watch the momentum build." })
      ]
    }
  );
}
function TrendingPage() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeCategory = CATEGORIES.find((c) => c === search.category) ?? "All";
  const setCategory = (cat) => {
    navigate({
      to: "/trending",
      search: cat === "All" ? {} : { category: cat },
      replace: true
    });
  };
  const sampleVideos = useSampleTrendingVideos();
  const { data: backendVideos, isLoading } = useTrendingVideos();
  const videos = backendVideos ?? sampleVideos;
  const sorted = [...videos].sort(
    (a, b) => computeTrendingScore(b) - computeTrendingScore(a)
  );
  const filtered = filterByCategory(sorted, activeCategory);
  const handleNavigate = (_id) => {
    navigate({ to: "/feed" });
  };
  const [showSkeleton, setShowSkeleton] = reactExports.useState(isLoading);
  reactExports.useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(t);
    }
    setShowSkeleton(true);
    return void 0;
  }, [isLoading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "trending.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border/50",
            "data-ocid": "trending.header",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 pt-4 pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: "🔥" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground tracking-tight", children: "Trending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-[oklch(0.72_0.18_40)]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                    filtered.length,
                    " videos"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex gap-2 px-4 pb-3 overflow-x-auto",
                  "data-ocid": "trending.category_filter_bar",
                  style: { msOverflowStyle: "none", scrollbarWidth: "none" },
                  children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CategoryChip,
                    {
                      label: cat,
                      active: activeCategory === cat,
                      onClick: () => setCategory(cat)
                    },
                    cat
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: showSkeleton ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.15 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingGridSkeleton, {})
          },
          "skeleton"
        ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.25 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
          },
          "empty"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "grid grid-cols-2 md:grid-cols-3 gap-2 px-3",
            "data-ocid": "trending.video_grid",
            children: filtered.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TrendingGridCard,
              {
                video,
                rank: i + 1,
                index: i,
                onNavigate: handleNavigate
              },
              video.id
            ))
          },
          `grid-${activeCategory}`
        ) }) })
      ]
    }
  );
}
export {
  TrendingPage as default
};
