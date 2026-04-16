import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { CreditCard, Gift, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCoinBalance,
  useCoinPacks,
  useCoinTransactions,
  usePurchaseCoins,
} from "../hooks/useCoinBalance";
import type { CoinPack, CoinTransaction } from "../types";

const GOLD_DIM = "oklch(0.72 0.14 68)";

const COIN_FILL_OUTER = "oklch(0.82 0.15 68 / 0.15)";
const COIN_FILL_INNER = "oklch(0.72 0.14 68 / 0.25)";
const COIN_STACK_COLORS = [
  "oklch(0.78 0.15 68 / 0.8)",
  "oklch(0.73 0.15 68 / 0.8)",
  "oklch(0.68 0.15 68 / 0.8)",
  "oklch(0.63 0.15 68 / 0.8)",
];

function CoinIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="TR Coin"
    >
      <title>TR Coin</title>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={COIN_FILL_OUTER}
        stroke={GOLD_DIM}
        strokeWidth="1.5"
      />
      <circle cx="24" cy="24" r="16" fill={COIN_FILL_INNER} />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fill={GOLD_DIM}
        fontFamily="sans-serif"
      >
        ₮
      </text>
    </svg>
  );
}

const STACK_SCALES = [1, 0.93, 0.86, 0.79];

function CoinStackIcon({ count = 3 }: { count?: number }) {
  const slices = COIN_STACK_COLORS.slice(0, count);
  return (
    <div className="flex flex-col items-center gap-0.5">
      {slices.map((bg, i) => (
        <div
          key={bg}
          className="w-7 h-2.5 rounded-full border"
          style={{
            background: bg,
            borderColor: GOLD_DIM,
            transform: `scaleX(${STACK_SCALES[i] ?? 0.79})`,
          }}
        />
      ))}
    </div>
  );
}

function TransactionIcon({ type }: { type: CoinTransaction["type"] }) {
  if (type === "gift_received")
    return (
      <Star className="w-4 h-4" style={{ color: GOLD_DIM }} fill={GOLD_DIM} />
    );
  if (type === "gift_sent")
    return <Star className="w-4 h-4 text-primary" fill="currentColor" />;
  if (type === "purchase")
    return <CreditCard className="w-4 h-4 text-primary" />;
  return <Gift className="w-4 h-4 text-muted-foreground" />;
}

function TransactionRow({ tx, index }: { tx: CoinTransaction; index: number }) {
  const isPositive = tx.type === "gift_received" || tx.type === "purchase";
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
      data-ocid={`wallet.transaction.item.${index + 1}`}
    >
      <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
        <TransactionIcon type={tx.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-display font-semibold truncate">
          {tx.description}
        </p>
        <p className="text-muted-foreground text-xs">{timeAgo(tx.createdAt)}</p>
      </div>
      <span
        className={cn(
          "font-display font-bold text-sm tabular-nums",
          isPositive ? "" : "text-destructive",
        )}
        style={isPositive ? { color: GOLD_DIM } : undefined}
      >
        {isPositive ? "+" : "-"}
        {Math.abs(tx.amount)}
      </span>
    </motion.div>
  );
}

function CoinPackCard({
  pack,
  onBuy,
  isPending,
}: {
  pack: CoinPack;
  onBuy: (e: React.MouseEvent) => void;
  isPending: boolean;
}) {
  const isBestValue = pack.coins >= 500 && pack.popular;
  const stackCount = pack.coins >= 1000 ? 4 : pack.coins >= 500 ? 3 : 2;

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border p-4 flex flex-col gap-3 cursor-pointer overflow-hidden",
        isBestValue
          ? "border-[oklch(0.72_0.14_68/0.6)] shadow-lg"
          : "border-border bg-card hover:border-border/80",
      )}
      style={
        isBestValue
          ? {
              background:
                "linear-gradient(135deg, oklch(0.14 0.04 68), oklch(0.12 0.02 68))",
              boxShadow: "0 0 24px oklch(0.72 0.14 68 / 0.15)",
            }
          : undefined
      }
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onBuy}
      data-ocid={`wallet.pack.${pack.id}.buy_button`}
    >
      {isBestValue && (
        <div
          className="absolute -top-px left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.72 0.14 68), transparent)",
          }}
        />
      )}
      {isBestValue && (
        <div
          className="absolute top-2.5 right-2.5 text-[9px] font-display font-black px-2 py-0.5 rounded-full"
          style={{ background: GOLD_DIM, color: "oklch(0.1 0 0)" }}
        >
          BEST VALUE
        </div>
      )}

      <div className="flex items-start gap-2">
        <CoinStackIcon count={stackCount} />
        <div className="flex flex-col min-w-0">
          <span className="font-display font-bold text-foreground text-sm leading-tight">
            {pack.name}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className="font-display font-black text-xl"
              style={{ color: GOLD_DIM }}
            >
              {pack.coins.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">coins</span>
          </div>
          {pack.bonus && (
            <span
              className="text-[10px] font-display font-semibold mt-0.5"
              style={{ color: "oklch(0.65 0.25 259)" }}
            >
              +{pack.bonus} bonus
            </span>
          )}
        </div>
      </div>

      <Button
        size="sm"
        className={cn("w-full font-display font-bold text-xs h-8")}
        variant={isBestValue ? "default" : "outline"}
        style={
          isBestValue
            ? {
                background:
                  "linear-gradient(135deg, oklch(0.72 0.14 68), oklch(0.62 0.14 68))",
                color: "oklch(0.1 0 0)",
                border: "none",
              }
            : undefined
        }
        disabled={isPending}
        data-ocid={`wallet.pack.${pack.id}.price_button`}
      >
        ${pack.price.toFixed(2)}
      </Button>
    </motion.div>
  );
}

// Floating coin animation
function FloatingCoin({
  x,
  y,
  onDone,
}: { x: number; y: number; onDone: () => void }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 text-xl coin-float"
      style={{ left: x - 12, top: y - 12 }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -80, scale: 0.6 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      🪙
    </motion.div>
  );
}

export default function WalletPage() {
  const { isAuthenticated, login } = useInternetIdentity();
  const { balance, isLoading: balanceLoading } = useCoinBalance();
  const { data: packs, isLoading: packsLoading } = useCoinPacks();
  const { data: transactions, isLoading: txLoading } = useCoinTransactions();
  const { mutate: purchaseCoins, isPending } = usePurchaseCoins();
  const [floatingCoins, setFloatingCoins] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [nextId, setNextId] = useState(0);

  const spawnCoins = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newCoins = Array.from({ length: 5 }, (_, i) => ({
      id: nextId + i,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
      y: rect.top + rect.height / 2,
    }));
    setFloatingCoins((prev) => [...prev, ...newCoins]);
    setNextId((n) => n + 5);
  };

  const handleBuy = (pack: CoinPack, e: React.MouseEvent) => {
    if (!isAuthenticated) {
      toast("Sign in to purchase coins", { icon: "🔐" });
      return;
    }
    spawnCoins(e);
    purchaseCoins(
      { packId: pack.id },
      {
        onSuccess: () =>
          toast.success(
            `🪙 ${pack.coins + (pack.bonus ?? 0)} coins added to your wallet!`,
          ),
        onError: () => toast.error("Purchase failed. Please try again."),
      },
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: "oklch(0.72 0.14 68 / 0.08)",
            border: "1px solid oklch(0.72 0.14 68 / 0.25)",
          }}
        >
          <CoinIcon size={44} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display font-bold text-foreground text-2xl mb-2"
        >
          My Wallet
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-muted-foreground text-sm mb-7 max-w-[260px] leading-relaxed"
        >
          Sign in to manage your TR Coins, send gifts, and support your
          favourite creators
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={login}
            data-ocid="wallet.login_button"
            className="font-display font-bold px-8"
            style={{
              background: `linear-gradient(135deg, ${GOLD_DIM}, oklch(0.62 0.14 68))`,
              color: "oklch(0.1 0 0)",
              border: "none",
            }}
          >
            Sign In to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="wallet.page">
      {/* Floating coin particles */}
      <AnimatePresence>
        {floatingCoins.map((c) => (
          <FloatingCoin
            key={c.id}
            x={c.x}
            y={c.y}
            onDone={() =>
              setFloatingCoins((prev) => prev.filter((fc) => fc.id !== c.id))
            }
          />
        ))}
      </AnimatePresence>

      {/* Balance Hero Card */}
      <div
        className="relative overflow-hidden px-4 pt-8 pb-8 text-center"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.14 0.06 259), oklch(0.10 0.03 68), oklch(0.08 0 0))",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.72 0.14 68 / 0.1), transparent)",
          }}
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center mb-3"
        >
          <CoinIcon size={64} />
        </motion.div>
        <p className="text-muted-foreground text-xs font-body tracking-widest uppercase mb-1">
          Time Reel Coins
        </p>
        {balanceLoading ? (
          <Skeleton className="h-14 w-32 mx-auto rounded-xl mb-4" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-baseline justify-center gap-2 mb-5"
          >
            <span
              className="font-display font-black text-6xl tabular-nums leading-none"
              style={{
                color: GOLD_DIM,
                textShadow: "0 0 30px oklch(0.72 0.14 68 / 0.5)",
              }}
              data-ocid="wallet.balance_display"
            >
              {balance.toLocaleString()}
            </span>
            <span className="text-muted-foreground font-display font-bold text-xl">
              TR
            </span>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Buy Coins Section */}
        <section data-ocid="wallet.topup_section">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display font-bold text-foreground text-lg">
              Top Up Coins
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mb-4">
            Support creators with TR Coins — starts at $0.99
          </p>

          {packsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-36 rounded-2xl"
                  data-ocid={`wallet.pack.loading_state.${i}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(packs ?? []).map((pack, i) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CoinPackCard
                    pack={pack}
                    onBuy={(e) => handleBuy(pack, e)}
                    isPending={isPending}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Transaction History */}
        <section data-ocid="wallet.transactions_section">
          <h2 className="font-display font-bold text-foreground text-lg mb-4">
            Transaction History
          </h2>

          {txLoading ? (
            <div
              className="space-y-3"
              data-ocid="wallet.transactions.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div
              className="bg-card border border-border rounded-2xl px-4 divide-y divide-border/50"
              data-ocid="wallet.transactions.list"
            >
              {transactions.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-2xl"
              data-ocid="wallet.transactions.empty_state"
            >
              <div className="text-4xl mb-3">🪙</div>
              <p className="font-display font-semibold text-foreground text-sm mb-1">
                No transactions yet
              </p>
              <p className="text-muted-foreground text-xs max-w-[200px] leading-relaxed">
                Buy some coins to get started — support creators with gifts!
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
