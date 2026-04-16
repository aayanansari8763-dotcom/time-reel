import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Home, PlusCircle, TrendingUp, User, Wallet } from "lucide-react";
import { useCoinsStore } from "../store/coins";
import { CoinBadge } from "./CoinBadge";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  isPrimary?: boolean;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/feed", icon: Home, label: "Feed" },
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/upload", icon: PlusCircle, label: "Upload", isPrimary: true },
  { to: "/wallet", icon: Wallet, label: "Wallet", requiresAuth: true },
  { to: "/profile/me", icon: User, label: "Profile", requiresAuth: true },
];

export function BottomTabBar() {
  const location = useLocation();
  const { isAuthenticated } = useInternetIdentity();
  const isAuth = isAuthenticated;
  const balance = useCoinsStore((s) => s.balance);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 pb-safe pt-1 border-t border-border/50"
      style={{
        background: "oklch(0.08 0 0 / 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname.startsWith(
          item.to === "/profile/me" ? "/profile" : item.to,
        );
        const Icon = item.icon;
        const showAuth = item.requiresAuth && !isAuth;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl min-w-[44px] min-h-[44px] justify-center transition-smooth relative",
              item.isPrimary
                ? "bg-primary rounded-full p-3 mb-2 shadow-lg shadow-primary/30"
                : isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={item.label}
            data-ocid={`nav.${item.label.toLowerCase()}_tab`}
          >
            <Icon
              className={cn(
                "transition-smooth",
                item.isPrimary ? "w-6 h-6 text-primary-foreground" : "w-5 h-5",
                isActive && !item.isPrimary && "scale-110",
              )}
              strokeWidth={isActive && !item.isPrimary ? 2.5 : 2}
            />
            {!item.isPrimary && (
              <span
                className={cn(
                  "text-[9px] font-display font-semibold",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            )}
            {item.to === "/wallet" && isAuth && balance > 0 && (
              <span className="absolute -top-1 -right-1">
                <CoinBadge amount={balance} size="sm" />
              </span>
            )}
            {showAuth && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
