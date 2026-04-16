import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { useMyProfile } from "../hooks/useProfile";
import { useCoinsStore } from "../store/coins";
import { AvatarImage } from "./AvatarImage";
import { BottomTabBar } from "./BottomTabBar";
import { CoinBadge } from "./CoinBadge";
import { Logo } from "./Logo";

interface LayoutProps {
  hideHeader?: boolean;
}

export function Layout({ hideHeader = false }: LayoutProps) {
  const { isAuthenticated, login, clear } = useInternetIdentity();
  const isAuth = isAuthenticated;
  const balance = useCoinsStore((s) => s.balance);
  const { data: myProfile } = useMyProfile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      {!hideHeader && (
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 h-12 border-b border-border/50"
          style={{
            background: "oklch(0.08 0 0 / 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Logo */}
          <Link
            to="/feed"
            className="flex items-center group"
            data-ocid="nav.logo_link"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { to: "/feed", label: "Feed" },
              { to: "/trending", label: "Trending" },
              { to: "/upload", label: "Upload" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground font-display font-medium text-sm transition-colors"
                data-ocid={`nav.desktop_${item.label.toLowerCase()}_link`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuth && (
              <>
                <Link
                  to="/wallet"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                  data-ocid="nav.coin_balance_button"
                >
                  <CoinBadge amount={balance} size="sm" showLabel />
                </Link>
                {myProfile && (
                  <AvatarImage
                    src={myProfile.avatarUrl}
                    alt={myProfile.handle}
                    size="xs"
                    ring
                    ringColor="cyan"
                  />
                )}
              </>
            )}
            <Button
              size="sm"
              variant={isAuth ? "ghost" : "default"}
              className={cn("h-7 px-3 text-xs font-display font-semibold")}
              onClick={isAuth ? clear : login}
              data-ocid={isAuth ? "nav.logout_button" : "nav.login_button"}
            >
              {isAuth ? (
                <>
                  <LogOut className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3 mr-1" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={cn("flex-1", hideHeader ? "h-screen" : "pb-16 md:pb-0")}>
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile only */}
      <div className="md:hidden">
        <BottomTabBar />
      </div>

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.16 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            color: "oklch(0.95 0 0)",
          },
        }}
      />
    </div>
  );
}
