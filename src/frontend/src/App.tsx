import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { VideoCardSkeleton } from "./components/LoadingSkeleton";

// Lazy load pages
const FeedPage = lazy(() => import("./pages/FeedPage"));
const TrendingPage = lazy(() => import("./pages/TrendingPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const EarningsPage = lazy(() => import("./pages/EarningsPage"));

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout routes for different header styles
const headerlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "headerless",
  component: () => <Layout hideHeader />,
});

const defaultLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "default",
  component: () => <Layout />,
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/feed" });
  },
  component: () => null,
});

const feedRoute = createRoute({
  getParentRoute: () => headerlessLayoutRoute,
  path: "/feed",
  component: () => (
    <Suspense fallback={<VideoCardSkeleton />}>
      <FeedPage />
    </Suspense>
  ),
});

const trendingRoute = createRoute({
  getParentRoute: () => headerlessLayoutRoute,
  path: "/trending",
  component: () => (
    <Suspense fallback={<VideoCardSkeleton />}>
      <TrendingPage />
    </Suspense>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/upload",
  component: () => (
    <Suspense fallback={<div className="p-8 animate-pulse" />}>
      <UploadPage />
    </Suspense>
  ),
});

const profileMeRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/profile/me",
  component: () => (
    <Suspense fallback={<div className="p-8 animate-pulse" />}>
      <ProfilePage handle="me" />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/profile/$handle",
  component: function ProfileRouteComponent() {
    const { handle } = profileRoute.useParams();
    return (
      <Suspense fallback={<div className="p-8 animate-pulse" />}>
        <ProfilePage handle={handle} />
      </Suspense>
    );
  },
});

const walletRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/wallet",
  component: () => (
    <Suspense fallback={<div className="p-8 animate-pulse" />}>
      <WalletPage />
    </Suspense>
  ),
});

const earningsRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/earnings",
  component: () => (
    <Suspense fallback={<div className="p-8 animate-pulse" />}>
      <EarningsPage />
    </Suspense>
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  headerlessLayoutRoute.addChildren([feedRoute, trendingRoute]),
  defaultLayoutRoute.addChildren([
    uploadRoute,
    profileMeRoute,
    profileRoute,
    walletRoute,
    earningsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
