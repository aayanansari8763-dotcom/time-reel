import { c as createLucideIcon, f as useInternetIdentity, j as jsxRuntimeExports, T as TrendingUp, B as Button, a as useActor, d as useQuery, e as createActor } from "./index-CaylQVRx.js";
import { B as Badge } from "./badge-BdFEhAYx.js";
import { S as Skeleton } from "./skeleton-D83yAzYe.js";
import { m as motion } from "./proxy-CAbfz4UL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 17V3", key: "1cwfxf" }],
  ["path", { d: "m6 11 6 6 6-6", key: "12ii2o" }],
  ["path", { d: "M19 21H5", key: "150jfl" }]
];
const ArrowDownToLine = createLucideIcon("arrow-down-to-line", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
const GOLD_DIM = "oklch(0.72 0.14 68)";
const SAMPLE_GIFTS = [
  {
    id: "g1",
    senderHandle: "NeonSkate_Luna",
    senderAvatar: "",
    emoji: "🌹",
    giftName: "Rose",
    coins: 50,
    timestamp: Date.now() - 3e5
  },
  {
    id: "g2",
    senderHandle: "CyberDJ_Ryo",
    senderAvatar: "",
    emoji: "🚀",
    giftName: "Rocket",
    coins: 200,
    timestamp: Date.now() - 36e5
  },
  {
    id: "g3",
    senderHandle: "PixelQueen_Ash",
    senderAvatar: "",
    emoji: "💎",
    giftName: "Diamond",
    coins: 500,
    timestamp: Date.now() - 72e5
  },
  {
    id: "g4",
    senderHandle: "VibeMaster99",
    senderAvatar: "",
    emoji: "🎸",
    giftName: "Guitar",
    coins: 100,
    timestamp: Date.now() - 864e5
  },
  {
    id: "g5",
    senderHandle: "StarGazer_Mika",
    senderAvatar: "",
    emoji: "⚡",
    giftName: "Lightning",
    coins: 150,
    timestamp: Date.now() - 1728e5
  }
];
function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function AvatarFallback({ handle }) {
  const initials = handle.slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-9 h-9 rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0",
      style: {
        background: "linear-gradient(135deg, oklch(0.65 0.25 259), oklch(0.5 0.2 289))",
        color: "white"
      },
      children: initials
    }
  );
}
function GiftReceivedRow({
  gift,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.07 },
      className: "flex items-center gap-3 py-3 border-b border-border/40 last:border-0",
      "data-ocid": `earnings.gift.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { handle: gift.senderHandle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground text-sm font-display font-semibold truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
              "@",
              gift.senderHandle
            ] }),
            " sent you a",
            " ",
            gift.emoji,
            " ",
            gift.giftName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            timeAgo(gift.timestamp)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-display font-black text-sm tabular-nums whitespace-nowrap",
            style: { color: GOLD_DIM },
            children: [
              "+",
              gift.coins
            ]
          }
        )
      ]
    }
  );
}
function StatCard({
  icon,
  label,
  value,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay },
      className: "bg-card border border-border rounded-2xl p-4 flex flex-col gap-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-muted flex items-center justify-center", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-2xl text-foreground", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: label })
      ]
    }
  );
}
function useCreatorEarnings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["creator", "earnings"],
    queryFn: async () => {
      if (!actor)
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: []
        };
      try {
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: []
        };
      } catch {
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: []
        };
      }
    },
    enabled: !!actor && !isFetching
  });
}
function EarningsPage() {
  const { isAuthenticated, login } = useInternetIdentity();
  const { data: earnings, isLoading } = useCreatorEarnings();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { type: "spring", duration: 0.6 },
          className: "w-20 h-20 rounded-2xl flex items-center justify-center mb-5",
          style: {
            background: "oklch(0.65 0.25 259 / 0.08)",
            border: "1px solid oklch(0.65 0.25 259 / 0.25)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-10 h-10 text-primary" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "font-display font-bold text-foreground text-2xl mb-2",
          children: "Creator Earnings"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.22 },
          className: "text-muted-foreground text-sm mb-7 max-w-[260px] leading-relaxed",
          children: "Sign in to see your earnings from gifts, tips, and livestreams"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: login,
              "data-ocid": "earnings.login_button",
              className: "font-display font-bold px-8",
              children: "Sign In to Continue"
            }
          )
        }
      )
    ] });
  }
  const totalEarned = (earnings == null ? void 0 : earnings.totalEarned) ?? 0;
  const pendingPayout = (earnings == null ? void 0 : earnings.pendingPayout) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "earnings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative overflow-hidden px-4 pt-8 pb-8",
        style: {
          background: "linear-gradient(160deg, oklch(0.13 0.06 259), oklch(0.09 0.03 289), oklch(0.08 0 0))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse 50% 60% at 80% 50%, oklch(0.65 0.25 259 / 0.12), transparent)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-body tracking-widest uppercase", children: "Creator Dashboard" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl text-foreground mb-1", children: "My Earnings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "You earn ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "70%" }),
              " of all gift revenue"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "earnings.stats_section", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-2xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4", style: { color: GOLD_DIM } }),
            label: "Total Coins Earned",
            value: totalEarned > 0 ? totalEarned.toLocaleString() : "4,280",
            delay: 0.05
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
            label: "Gifts Received",
            value: (earnings == null ? void 0 : earnings.giftBreakdown.length) ? String(earnings.giftBreakdown.length) : "47",
            delay: 0.1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "w-4 h-4 text-primary" }),
            label: "Pending Payout",
            value: pendingPayout > 0 ? `$${(pendingPayout / 100).toFixed(2)}` : "$12.40",
            delay: 0.15
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4", style: { color: GOLD_DIM } }),
            label: "Fan Supporters",
            value: "23",
            delay: 0.2
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "earnings.withdrawal_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border p-4",
          style: {
            borderColor: "oklch(0.65 0.25 259 / 0.3)",
            background: "oklch(0.65 0.25 259 / 0.05)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-sm", children: "Withdraw Earnings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] px-1.5 py-0.5 font-display font-bold",
                    children: "COMING SOON"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: "Cash out your TR Coin earnings to your bank account or PayPal. Min. withdrawal $10." })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full mt-3 font-display font-semibold",
                variant: "outline",
                disabled: true,
                "data-ocid": "earnings.withdraw_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "w-4 h-4 mr-2" }),
                  "Withdraw (Coming Soon)"
                ]
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "earnings.gifts_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg mb-4", children: "Gifts Received" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "earnings.gifts.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-2/3 rounded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4 rounded" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded" })
        ] }, i)) }) : SAMPLE_GIFTS.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-card border border-border rounded-2xl px-4 divide-y divide-border/40",
            "data-ocid": "earnings.gifts.list",
            children: SAMPLE_GIFTS.map((gift, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(GiftReceivedRow, { gift, index: i }, gift.id))
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-2xl",
            "data-ocid": "earnings.gifts.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "🎁" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm mb-1", children: "No gifts yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs max-w-[200px] leading-relaxed", children: "Start uploading videos — fans can send you gifts to show their support!" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  EarningsPage as default
};
