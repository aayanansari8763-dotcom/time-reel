import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="w-full h-screen snap-center flex-shrink-0 relative bg-background">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
      </div>
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-8 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center gap-3 py-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-24 h-4" />
        <div className="flex gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="w-12 h-5" />
              <Skeleton className="w-16 h-3" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"].map((k) => (
          <Skeleton key={k} className="aspect-[9/16]" />
        ))}
      </div>
    </div>
  );
}
