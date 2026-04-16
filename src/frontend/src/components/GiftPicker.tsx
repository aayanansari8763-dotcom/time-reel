import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendGift } from "../hooks/useComments";
import { useCoinsStore } from "../store/coins";
import type { Gift } from "../types";
import { CoinBadge } from "./CoinBadge";

const GIFTS: Gift[] = [
  {
    id: "g1",
    name: "Star",
    emoji: "⭐",
    coinCost: 5,
    animationClass: "coin-float",
  },
  {
    id: "g2",
    name: "Fire",
    emoji: "🔥",
    coinCost: 10,
    animationClass: "coin-float",
  },
  {
    id: "g3",
    name: "Lightning",
    emoji: "⚡",
    coinCost: 25,
    animationClass: "coin-float",
  },
  {
    id: "g4",
    name: "Diamond",
    emoji: "💎",
    coinCost: 50,
    animationClass: "coin-float",
  },
  {
    id: "g5",
    name: "Cyber Heart",
    emoji: "💙",
    coinCost: 75,
    animationClass: "coin-float",
  },
  {
    id: "g6",
    name: "Crown",
    emoji: "👑",
    coinCost: 100,
    animationClass: "coin-float",
  },
  {
    id: "g7",
    name: "Rocket",
    emoji: "🚀",
    coinCost: 200,
    animationClass: "coin-float",
  },
  {
    id: "g8",
    name: "Galaxy",
    emoji: "🌌",
    coinCost: 500,
    animationClass: "coin-float",
  },
];

interface GiftPickerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

export function GiftPicker({ videoId, isOpen, onClose }: GiftPickerProps) {
  const [selected, setSelected] = useState<Gift | null>(null);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const balance = useCoinsStore((s) => s.balance);
  const deductCoins = useCoinsStore((s) => s.deductCoins);
  const { mutate: sendGift, isPending } = useSendGift();

  const canAfford = selected ? balance >= selected.coinCost : false;

  const handleSend = () => {
    if (!selected) return;
    if (balance < selected.coinCost) {
      toast.error("Not enough TR Coins! Top up in your wallet. 💰");
      return;
    }

    const newCoins: FloatingCoin[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 220,
      y: -(Math.random() * 120 + 60),
    }));
    setFloatingCoins(newCoins);
    setTimeout(() => setFloatingCoins([]), 1500);

    deductCoins(selected.coinCost);
    sendGift({ videoId, giftId: selected.id });
    toast.success(`${selected.emoji} ${selected.name} sent!`, {
      description: `−${selected.coinCost} TR Coins`,
    });
    onClose();
    setSelected(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-ocid="gift_picker.dialog"
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/10"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.14 0 0 / 0.97) 0%, oklch(0.11 0 0 / 0.99) 100%)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-4 pb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Send a Gift
                  </h3>
                  <p className="text-white/50 text-xs font-body mt-0.5">
                    Support your favourite creator
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <CoinBadge amount={balance} showLabel />
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close gift picker"
                    data-ocid="gift_picker.close_button"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Gift grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {GIFTS.map((gift) => {
                  const isSelected = selected?.id === gift.id;
                  const affordable = balance >= gift.coinCost;
                  return (
                    <motion.button
                      key={gift.id}
                      type="button"
                      onClick={() => setSelected(gift)}
                      whileTap={{ scale: 0.92 }}
                      data-ocid={`gift_picker.item.${gift.id}`}
                      className={cn(
                        "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-smooth relative overflow-hidden",
                        isSelected
                          ? "border-[oklch(0.72_0.14_68)] bg-[oklch(0.72_0.14_68/0.15)] shadow-[0_0_14px_oklch(0.72_0.14_68/0.35)]"
                          : affordable
                            ? "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
                            : "border-white/5 bg-white/3 opacity-50 cursor-not-allowed",
                      )}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-[oklch(0.72_0.14_68/0.08)] pointer-events-none" />
                      )}
                      <span className="text-2xl leading-none">
                        {gift.emoji}
                      </span>
                      <span className="text-[9px] text-white/60 font-body leading-none">
                        {gift.name}
                      </span>
                      <CoinBadge amount={gift.coinCost} size="sm" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Send button with floating coins */}
              <div className="relative">
                {floatingCoins.map((coin) => (
                  <motion.div
                    key={coin.id}
                    className="absolute bottom-8 left-1/2 text-lg pointer-events-none z-10"
                    animate={{ x: coin.x, y: coin.y, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    🪙
                  </motion.div>
                ))}
                <Button
                  className={cn(
                    "w-full font-display font-bold text-sm transition-smooth",
                    selected && canAfford
                      ? "bg-[oklch(0.72_0.14_68)] hover:bg-[oklch(0.68_0.16_68)] text-[oklch(0.05_0_0)] shadow-[0_0_20px_oklch(0.72_0.14_68/0.4)]"
                      : "bg-white/10 text-white/40",
                  )}
                  disabled={!selected || isPending || !canAfford}
                  onClick={handleSend}
                  data-ocid="gift_picker.confirm_button"
                >
                  {isPending
                    ? "Sending..."
                    : selected
                      ? canAfford
                        ? `Send ${selected.emoji} ${selected.name} · ${selected.coinCost} coins`
                        : `Need ${selected.coinCost - balance} more coins`
                      : "Select a gift to send"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
