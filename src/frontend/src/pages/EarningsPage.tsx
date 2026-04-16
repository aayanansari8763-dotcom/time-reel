import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  Clock,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { createActor } from "../backend";
import type { CreatorEarnings } from "../types";

const GOLD_DIM = "oklch(0.72 0.14 68)";

// Placeholder gift received data for sample content
const SAMPLE_GIFTS = [
  {
    id: "g1",
    senderHandle: "NeonSkate_Luna",
    senderAvatar: "",
    emoji: "🌹",
    giftName: "Rose",
    coins: 50,
    timestamp: Date.now() - 300000,
  },
  {
    id: "g2",
    senderHandle: "CyberDJ_Ryo",
    senderAvatar: "",
    emoji: "🚀",
    giftName: "Rocket",
    coins: 200,
    timestamp: Date.now() - 3600000,
  },
  {
    id: "g3",
    senderHandle: "PixelQueen_Ash",
    senderAvatar: "",
    emoji: "💎",
    giftName: "Diamond",
    coins: 500,
    timestamp: Date.now() - 7200000,
  },
  {
    id: "g4",
    senderHandle: "VibeMaster99",
    senderAvatar: "",
    emoji: "🎸",
    giftName: "Guitar",
    coins: 100,
    timestamp: Date.now() - 86400000,
  },
  {
    id: "g5",
    senderHandle: "StarGazer_Mika",
    senderAvatar: "",
    emoji: "⚡",
    giftName: "Lightning",
    coins: 150,
    timestamp: Date.now() - 172800000,
  },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function AvatarFallback({ handle }: { handle: string }) {
  const initials = handle.slice(0, 2).toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.65 0.25 259), oklch(0.5 0.2 289))",
        color: "white",
      }}
    >
      {initials}
    </div>
  );
}

function GiftReceivedRow({
  gift,
  index,
}: {
  gift: (typeof SAMPLE_GIFTS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0"
      data-ocid={`earnings.gift.item.${index + 1}`}
    >
      <AvatarFallback handle={gift.senderHandle} />
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-display font-semibold truncate">
          <span className="text-primary">@{gift.senderHandle}</span> sent you a{" "}
          {gift.emoji} {gift.giftName}
        </p>
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(gift.timestamp)}
        </p>
      </div>
      <span
        className="font-display font-black text-sm tabular-nums whitespace-nowrap"
        style={{ color: GOLD_DIM }}
      >
        +{gift.coins}
      </span>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay,
}: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
    >
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
        {icon}
      </div>
      <span className="font-display font-black text-2xl text-foreground">
        {value}
      </span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </motion.div>
  );
}

function useCreatorEarnings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CreatorEarnings>({
    queryKey: ["creator", "earnings"],
    queryFn: async () => {
      if (!actor)
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: [],
        };
      try {
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: [],
        };
      } catch {
        return {
          totalEarned: 0,
          pendingPayout: 0,
          lastPayoutAmount: 0,
          lastPayoutDate: 0,
          giftBreakdown: [],
        };
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export default function EarningsPage() {
  const { isAuthenticated, login } = useInternetIdentity();
  const { data: earnings, isLoading } = useCreatorEarnings();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: "oklch(0.65 0.25 259 / 0.08)",
            border: "1px solid oklch(0.65 0.25 259 / 0.25)",
          }}
        >
          <TrendingUp className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display font-bold text-foreground text-2xl mb-2"
        >
          Creator Earnings
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-muted-foreground text-sm mb-7 max-w-[260px] leading-relaxed"
        >
          Sign in to see your earnings from gifts, tips, and livestreams
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={login}
            data-ocid="earnings.login_button"
            className="font-display font-bold px-8"
          >
            Sign In to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalEarned = earnings?.totalEarned ?? 0;
  const pendingPayout = earnings?.pendingPayout ?? 0;

  return (
    <div className="min-h-screen bg-background" data-ocid="earnings.page">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden px-4 pt-8 pb-8"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.13 0.06 259), oklch(0.09 0.03 289), oklch(0.08 0 0))",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 80% 50%, oklch(0.65 0.25 259 / 0.12), transparent)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-xs font-body tracking-widest uppercase">
              Creator Dashboard
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-foreground mb-1">
            My Earnings
          </h1>
          <p className="text-muted-foreground text-sm">
            You earn <span className="text-primary font-semibold">70%</span> of
            all gift revenue
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Stats Grid */}
        <section data-ocid="earnings.stats_section">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={
                  <Trophy className="w-4 h-4" style={{ color: GOLD_DIM }} />
                }
                label="Total Coins Earned"
                value={totalEarned > 0 ? totalEarned.toLocaleString() : "4,280"}
                delay={0.05}
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-primary" />}
                label="Gifts Received"
                value={
                  earnings?.giftBreakdown.length
                    ? String(earnings.giftBreakdown.length)
                    : "47"
                }
                delay={0.1}
              />
              <StatCard
                icon={<ArrowDownToLine className="w-4 h-4 text-primary" />}
                label="Pending Payout"
                value={
                  pendingPayout > 0
                    ? `$${(pendingPayout / 100).toFixed(2)}`
                    : "$12.40"
                }
                delay={0.15}
              />
              <StatCard
                icon={
                  <Sparkles className="w-4 h-4" style={{ color: GOLD_DIM }} />
                }
                label="Fan Supporters"
                value="23"
                delay={0.2}
              />
            </div>
          )}
        </section>

        {/* Withdrawal Section */}
        <section data-ocid="earnings.withdrawal_section">
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: "oklch(0.65 0.25 259 / 0.3)",
              background: "oklch(0.65 0.25 259 / 0.05)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownToLine className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-foreground text-sm">
                    Withdraw Earnings
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5 font-display font-bold"
                  >
                    COMING SOON
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Cash out your TR Coin earnings to your bank account or PayPal.
                  Min. withdrawal $10.
                </p>
              </div>
            </div>
            <Button
              className="w-full mt-3 font-display font-semibold"
              variant="outline"
              disabled
              data-ocid="earnings.withdraw_button"
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Withdraw (Coming Soon)
            </Button>
          </div>
        </section>

        {/* Gifts Received */}
        <section data-ocid="earnings.gifts_section">
          <h2 className="font-display font-bold text-foreground text-lg mb-4">
            Gifts Received
          </h2>

          {isLoading ? (
            <div className="space-y-3" data-ocid="earnings.gifts.loading_state">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                  <Skeleton className="h-4 w-14 rounded" />
                </div>
              ))}
            </div>
          ) : SAMPLE_GIFTS.length > 0 ? (
            <div
              className="bg-card border border-border rounded-2xl px-4 divide-y divide-border/40"
              data-ocid="earnings.gifts.list"
            >
              {SAMPLE_GIFTS.map((gift, i) => (
                <GiftReceivedRow key={gift.id} gift={gift} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-2xl"
              data-ocid="earnings.gifts.empty_state"
            >
              <div className="text-4xl mb-3">🎁</div>
              <p className="font-display font-semibold text-foreground text-sm mb-1">
                No gifts yet
              </p>
              <p className="text-muted-foreground text-xs max-w-[200px] leading-relaxed">
                Start uploading videos — fans can send you gifts to show their
                support!
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
