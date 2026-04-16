import { cn } from "@/lib/utils";

interface CoinBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

function formatCoins(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function CoinBadge({
  amount,
  size = "md",
  className,
  showLabel = false,
}: CoinBadgeProps) {
  const sizes = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1.5",
  };
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-display font-bold",
        sizes[size],
        className,
      )}
    >
      <span
        className={cn(
          "rounded-full bg-[oklch(0.72_0.14_68)] flex items-center justify-center text-[oklch(0.1_0_0)] font-black leading-none",
          iconSizes[size],
        )}
      >
        ©
      </span>
      <span className="text-[oklch(0.72_0.14_68)]">{formatCoins(amount)}</span>
      {showLabel && (
        <span className="text-muted-foreground font-normal text-xs ml-0.5">
          TR
        </span>
      )}
    </span>
  );
}
