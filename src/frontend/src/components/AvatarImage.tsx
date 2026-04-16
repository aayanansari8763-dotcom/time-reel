import { cn } from "@/lib/utils";
import { useState } from "react";

interface AvatarImageProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
  ringColor?: "cyan" | "gold" | "none";
}

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

const RING_CLASSES = {
  cyan: "ring-2 ring-primary ring-offset-1 ring-offset-background",
  gold: "ring-2 ring-[oklch(0.72_0.14_68)] ring-offset-1 ring-offset-background",
  none: "",
};

export function AvatarImage({
  src,
  alt,
  size = "md",
  className,
  ring = false,
  ringColor = "cyan",
}: AvatarImageProps) {
  const [errored, setErrored] = useState(false);
  const initials = alt
    .split(/[\s_]/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0 bg-muted",
        SIZE_CLASSES[size],
        ring && RING_CLASSES[ringColor],
        className,
      )}
    >
      {errored ? (
        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-display font-bold">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
