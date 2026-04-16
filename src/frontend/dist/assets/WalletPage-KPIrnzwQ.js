import { c as createLucideIcon, a as useActor, h as useCoinsStore, d as useQuery, r as reactExports, u as useQueryClient, b as useMutation, e as createActor, f as useInternetIdentity, j as jsxRuntimeExports, B as Button, i as ue, g as cn } from "./index-CaylQVRx.js";
import { S as Skeleton } from "./skeleton-D83yAzYe.js";
import { m as motion } from "./proxy-CAbfz4UL.js";
import { A as AnimatePresence } from "./index-xJDs66J8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode$1);
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const SAMPLE_COIN_PACKS = [
  { id: "pack_s", name: "Starter", coins: 100, price: 0.99 },
  {
    id: "pack_m",
    name: "Popular",
    coins: 500,
    price: 4.99,
    bonus: 50,
    popular: true
  },
  { id: "pack_l", name: "Creator", coins: 1e3, price: 8.99, bonus: 200 },
  { id: "pack_xl", name: "Influencer", coins: 5e3, price: 39.99, bonus: 1500 }
];
function useCoinBalance() {
  const { actor, isFetching } = useActor(createActor);
  const setBalance = useCoinsStore((s) => s.setBalance);
  const balance = useCoinsStore((s) => s.balance);
  const query = useQuery({
    queryKey: ["coins", "balance"],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        return 0;
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
  reactExports.useEffect(() => {
    if (query.data !== void 0) {
      setBalance(query.data);
    }
  }, [query.data, setBalance]);
  return { ...query, balance };
}
function useCoinTransactions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["coins", "transactions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching
  });
}
function useCoinPacks() {
  return useQuery({
    queryKey: ["coins", "packs"],
    queryFn: async () => SAMPLE_COIN_PACKS,
    staleTime: Number.POSITIVE_INFINITY
  });
}
function usePurchaseCoins() {
  const queryClient = useQueryClient();
  const addCoins = useCoinsStore((s) => s.addCoins);
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({ packId }) => {
      if (!actor) throw new Error("Not authenticated");
      const pack = SAMPLE_COIN_PACKS.find((p) => p.id === packId);
      if (!pack) throw new Error("Pack not found");
      return pack;
    },
    onSuccess: (pack) => {
      if (pack) {
        addCoins(pack.coins + (pack.bonus ?? 0));
      }
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    }
  });
}
const GOLD_DIM = "oklch(0.72 0.14 68)";
const COIN_FILL_OUTER = "oklch(0.82 0.15 68 / 0.15)";
const COIN_FILL_INNER = "oklch(0.72 0.14 68 / 0.25)";
const COIN_STACK_COLORS = [
  "oklch(0.78 0.15 68 / 0.8)",
  "oklch(0.73 0.15 68 / 0.8)",
  "oklch(0.68 0.15 68 / 0.8)",
  "oklch(0.63 0.15 68 / 0.8)"
];
function CoinIcon({ size = 48 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 48 48",
      fill: "none",
      "aria-label": "TR Coin",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "TR Coin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "24",
            cy: "24",
            r: "22",
            fill: COIN_FILL_OUTER,
            stroke: GOLD_DIM,
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "24", r: "16", fill: COIN_FILL_INNER }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "24",
            y: "30",
            textAnchor: "middle",
            fontSize: "16",
            fontWeight: "900",
            fill: GOLD_DIM,
            fontFamily: "sans-serif",
            children: "₮"
          }
        )
      ]
    }
  );
}
const STACK_SCALES = [1, 0.93, 0.86, 0.79];
function CoinStackIcon({ count = 3 }) {
  const slices = COIN_STACK_COLORS.slice(0, count);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-0.5", children: slices.map((bg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-7 h-2.5 rounded-full border",
      style: {
        background: bg,
        borderColor: GOLD_DIM,
        transform: `scaleX(${STACK_SCALES[i] ?? 0.79})`
      }
    },
    bg
  )) });
}
function TransactionIcon({ type }) {
  if (type === "gift_received")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4", style: { color: GOLD_DIM }, fill: GOLD_DIM });
  if (type === "gift_sent")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary", fill: "currentColor" });
  if (type === "purchase")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "w-4 h-4 text-muted-foreground" });
}
function TransactionRow({ tx, index }) {
  const isPositive = tx.type === "gift_received" || tx.type === "purchase";
  const timeAgo = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 6e4) return "just now";
    if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
    if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
    return `${Math.floor(diff / 864e5)}d ago`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06 },
      className: "flex items-center gap-3 py-3 border-b border-border/50 last:border-0",
      "data-ocid": `wallet.transaction.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionIcon, { type: tx.type }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm font-display font-semibold truncate", children: tx.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: timeAgo(tx.createdAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "font-display font-bold text-sm tabular-nums",
              isPositive ? "" : "text-destructive"
            ),
            style: isPositive ? { color: GOLD_DIM } : void 0,
            children: [
              isPositive ? "+" : "-",
              Math.abs(tx.amount)
            ]
          }
        )
      ]
    }
  );
}
function CoinPackCard({
  pack,
  onBuy,
  isPending
}) {
  const isBestValue = pack.coins >= 500 && pack.popular;
  const stackCount = pack.coins >= 1e3 ? 4 : pack.coins >= 500 ? 3 : 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: cn(
        "relative rounded-2xl border p-4 flex flex-col gap-3 cursor-pointer overflow-hidden",
        isBestValue ? "border-[oklch(0.72_0.14_68/0.6)] shadow-lg" : "border-border bg-card hover:border-border/80"
      ),
      style: isBestValue ? {
        background: "linear-gradient(135deg, oklch(0.14 0.04 68), oklch(0.12 0.02 68))",
        boxShadow: "0 0 24px oklch(0.72 0.14 68 / 0.15)"
      } : void 0,
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.97 },
      onClick: onBuy,
      "data-ocid": `wallet.pack.${pack.id}.buy_button`,
      children: [
        isBestValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-px left-0 right-0 h-0.5",
            style: {
              background: "linear-gradient(90deg, transparent, oklch(0.72 0.14 68), transparent)"
            }
          }
        ),
        isBestValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-2.5 right-2.5 text-[9px] font-display font-black px-2 py-0.5 rounded-full",
            style: { background: GOLD_DIM, color: "oklch(0.1 0 0)" },
            children: "BEST VALUE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CoinStackIcon, { count: stackCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-sm leading-tight", children: pack.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display font-black text-xl",
                  style: { color: GOLD_DIM },
                  children: pack.coins.toLocaleString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "coins" })
            ] }),
            pack.bonus && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] font-display font-semibold mt-0.5",
                style: { color: "oklch(0.65 0.25 259)" },
                children: [
                  "+",
                  pack.bonus,
                  " bonus"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: cn("w-full font-display font-bold text-xs h-8"),
            variant: isBestValue ? "default" : "outline",
            style: isBestValue ? {
              background: "linear-gradient(135deg, oklch(0.72 0.14 68), oklch(0.62 0.14 68))",
              color: "oklch(0.1 0 0)",
              border: "none"
            } : void 0,
            disabled: isPending,
            "data-ocid": `wallet.pack.${pack.id}.price_button`,
            children: [
              "$",
              pack.price.toFixed(2)
            ]
          }
        )
      ]
    }
  );
}
function FloatingCoin({
  x,
  y,
  onDone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed pointer-events-none z-50 text-xl coin-float",
      style: { left: x - 12, top: y - 12 },
      initial: { opacity: 1, y: 0, scale: 1 },
      animate: { opacity: 0, y: -80, scale: 0.6 },
      transition: { duration: 1.2, ease: "easeOut" },
      onAnimationComplete: onDone,
      children: "🪙"
    }
  );
}
function WalletPage() {
  const { isAuthenticated, login } = useInternetIdentity();
  const { balance, isLoading: balanceLoading } = useCoinBalance();
  const { data: packs, isLoading: packsLoading } = useCoinPacks();
  const { data: transactions, isLoading: txLoading } = useCoinTransactions();
  const { mutate: purchaseCoins, isPending } = usePurchaseCoins();
  const [floatingCoins, setFloatingCoins] = reactExports.useState([]);
  const [nextId, setNextId] = reactExports.useState(0);
  const spawnCoins = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newCoins = Array.from({ length: 5 }, (_, i) => ({
      id: nextId + i,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
      y: rect.top + rect.height / 2
    }));
    setFloatingCoins((prev) => [...prev, ...newCoins]);
    setNextId((n) => n + 5);
  };
  const handleBuy = (pack, e) => {
    if (!isAuthenticated) {
      ue("Sign in to purchase coins", { icon: "🔐" });
      return;
    }
    spawnCoins(e);
    purchaseCoins(
      { packId: pack.id },
      {
        onSuccess: () => ue.success(
          `🪙 ${pack.coins + (pack.bonus ?? 0)} coins added to your wallet!`
        ),
        onError: () => ue.error("Purchase failed. Please try again.")
      }
    );
  };
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
            background: "oklch(0.72 0.14 68 / 0.08)",
            border: "1px solid oklch(0.72 0.14 68 / 0.25)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoinIcon, { size: 44 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "font-display font-bold text-foreground text-2xl mb-2",
          children: "My Wallet"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.22 },
          className: "text-muted-foreground text-sm mb-7 max-w-[260px] leading-relaxed",
          children: "Sign in to manage your TR Coins, send gifts, and support your favourite creators"
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
              "data-ocid": "wallet.login_button",
              className: "font-display font-bold px-8",
              style: {
                background: `linear-gradient(135deg, ${GOLD_DIM}, oklch(0.62 0.14 68))`,
                color: "oklch(0.1 0 0)",
                border: "none"
              },
              children: "Sign In to Continue"
            }
          )
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "wallet.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: floatingCoins.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingCoin,
      {
        x: c.x,
        y: c.y,
        onDone: () => setFloatingCoins((prev) => prev.filter((fc) => fc.id !== c.id))
      },
      c.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative overflow-hidden px-4 pt-8 pb-8 text-center",
        style: {
          background: "linear-gradient(160deg, oklch(0.14 0.06 259), oklch(0.10 0.03 68), oklch(0.08 0 0))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.72 0.14 68 / 0.1), transparent)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.7, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { type: "spring", stiffness: 200, damping: 20 },
              className: "flex justify-center mb-3",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoinIcon, { size: 64 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs font-body tracking-widest uppercase mb-1", children: "Time Reel Coins" }),
          balanceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-32 mx-auto rounded-xl mb-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              className: "flex items-baseline justify-center gap-2 mb-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-display font-black text-6xl tabular-nums leading-none",
                    style: {
                      color: GOLD_DIM,
                      textShadow: "0 0 30px oklch(0.72 0.14 68 / 0.5)"
                    },
                    "data-ocid": "wallet.balance_display",
                    children: balance.toLocaleString()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-display font-bold text-xl", children: "TR" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "wallet.topup_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg", children: "Top Up Coins" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-4", children: "Support creators with TR Coins — starts at $0.99" }),
        packsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-36 rounded-2xl",
            "data-ocid": `wallet.pack.loading_state.${i}`
          },
          i
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: (packs ?? []).map((pack, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: i * 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CoinPackCard,
              {
                pack,
                onBuy: (e) => handleBuy(pack, e),
                isPending
              }
            )
          },
          pack.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "wallet.transactions_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg mb-4", children: "Transaction History" }),
        txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "space-y-3",
            "data-ocid": "wallet.transactions.loading_state",
            children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3/4 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3 rounded" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 rounded" })
            ] }, i))
          }
        ) : transactions && transactions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-card border border-border rounded-2xl px-4 divide-y divide-border/50",
            "data-ocid": "wallet.transactions.list",
            children: transactions.map((tx, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionRow, { tx, index: i }, tx.id))
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-2xl",
            "data-ocid": "wallet.transactions.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "🪙" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm mb-1", children: "No transactions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs max-w-[200px] leading-relaxed", children: "Buy some coins to get started — support creators with gifts!" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  WalletPage as default
};
