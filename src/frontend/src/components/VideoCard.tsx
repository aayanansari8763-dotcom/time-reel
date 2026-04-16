import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { BadgeCheck, Heart, MessageCircle, Music, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFollow, useFollowStatus } from "../hooks/useFollowStatus";
import { useLikeVideo } from "../hooks/useVideoFeed";
import type { VideoInfo } from "../types";
import { AvatarImage } from "./AvatarImage";
import { CoinBadge } from "./CoinBadge";
import { CommentDrawer } from "./CommentDrawer";
import { GiftPicker } from "./GiftPicker";

interface VideoCardProps {
  video: VideoInfo;
  index: number;
  onBecameActive: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function VideoCard({
  video,
  index,
  onBecameActive,
  containerRef,
}: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [liked, setLiked] = useState(video.isLiked);
  const [likeCount, setLikeCount] = useState(video.likeCount);
  const [showHearts, setShowHearts] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated } = useInternetIdentity();
  const isAuth = isAuthenticated;
  const { isFollowing } = useFollowStatus(video.creatorHandle);
  const { mutate: followMutation } = useFollow();
  const { mutate: likeMutation } = useLikeVideo();

  // IntersectionObserver: activate when >= 60% visible
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        setIsActive(active);
        if (active) onBecameActive(index);
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [index, onBecameActive, containerRef]);

  // Auto-play / pause video based on active state
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive]);

  const triggerHeartBurst = useCallback((clientX: number, clientY: number) => {
    const id = Date.now();
    const newHearts = Array.from({ length: 7 }, (_, i) => ({
      id: id + i,
      x: clientX + (Math.random() - 0.5) * 100,
      y: clientY + (Math.random() - 0.5) * 100,
    }));
    setShowHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setShowHearts((prev) =>
        prev.filter((h) => !newHearts.find((n) => n.id === h.id)),
      );
    }, 800);
  }, []);

  const doLike = useCallback(
    (clientX: number, clientY: number) => {
      if (!liked) {
        setLiked(true);
        setLikeCount((c) => c + 1);
        triggerHeartBurst(clientX, clientY);
        likeMutation({ videoId: video.id, isLiked: false });
      } else {
        triggerHeartBurst(clientX, clientY);
      }
    },
    [liked, triggerHeartBurst, likeMutation, video.id],
  );

  const handleTap = useCallback(
    (e: React.MouseEvent) => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
        // Double tap — like!
        doLike(e.clientX, e.clientY);
      } else {
        tapTimerRef.current = setTimeout(() => {
          tapTimerRef.current = null;
          // Single tap — toggle play/pause
          const vid = videoRef.current;
          if (!vid) return;
          if (vid.paused) {
            vid.play().catch(() => {});
            setPaused(false);
          } else {
            vid.pause();
            setPaused(true);
          }
        }, 220);
      }
    },
    [doLike],
  );

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast("Log in to like videos", { icon: "🔐" });
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : c - 1));
    if (newLiked) triggerHeartBurst(e.clientX, e.clientY);
    likeMutation({ videoId: video.id, isLiked: liked });
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast("Log in to follow creators", { icon: "🔐" });
      return;
    }
    followMutation({
      handle: video.creatorHandle,
      currentlyFollowing: isFollowing,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://timereel.app/v/${video.id}`;
    if (navigator.share) {
      navigator.share({ title: video.caption, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      toast("Link copied!", { icon: "🔗" });
    }
  };

  const handleGift = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast("Log in to send gifts", { icon: "🔐" });
      return;
    }
    setShowGiftPicker(true);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{
        height: "100dvh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      data-ocid={`video_feed.item.${index + 1}`}
    >
      {/* Tap area */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default focus:outline-none z-10"
        onClick={handleTap}
        aria-label="Tap to pause/play, double tap to like"
      />

      {/* Video */}
      {videoError ? (
        <div className="absolute inset-0 w-full h-full bg-muted/20 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">📵</span>
          <span className="text-white/60 text-xs font-body">
            Video unavailable
          </span>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          preload={index <= 1 ? "auto" : "metadata"}
          poster={video.thumbnailUrl}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onError={() => setVideoError(true)}
          onLoadedData={() => setVideoError(false)}
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Pause indicator */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart burst particles */}
      {showHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none z-50 text-xl select-none"
          style={{ left: heart.x - 12, top: heart.y - 12 }}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2.2, y: -80 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          💙
        </motion.div>
      ))}

      {/* Right-side action buttons */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
        {/* Creator avatar + follow */}
        <div className="relative mb-1">
          <AvatarImage
            src={video.creatorAvatar}
            alt={video.creatorHandle}
            size="md"
            ring
            ringColor="cyan"
          />
          <button
            type="button"
            onClick={handleFollow}
            className={cn(
              "absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-smooth shadow-md",
              isFollowing
                ? "bg-muted text-foreground border border-border"
                : "bg-[oklch(0.72_0.2_200)] text-[oklch(0.05_0_0)]",
            )}
            aria-label={isFollowing ? "Unfollow" : "Follow"}
            data-ocid={`video_feed.follow_button.${index + 1}`}
          >
            {isFollowing ? "✓" : "+"}
          </button>
        </div>

        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
          aria-label={`${liked ? "Unlike" : "Like"} video`}
          data-ocid={`video_feed.like_button.${index + 1}`}
        >
          <motion.div
            whileTap={{ scale: 0.75 }}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-smooth",
              liked
                ? "bg-[oklch(0.65_0.25_259/0.2)] shadow-[0_0_16px_oklch(0.65_0.25_259/0.5)]"
                : "bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)]",
            )}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-smooth",
                liked
                  ? "fill-[oklch(0.72_0.2_200)] text-[oklch(0.72_0.2_200)]"
                  : "text-white",
              )}
            />
          </motion.div>
          <span className="text-white text-xs font-display font-bold drop-shadow-md">
            {formatCount(likeCount)}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={handleComment}
          className="flex flex-col items-center gap-1 group"
          aria-label="Open comments"
          data-ocid={`video_feed.comment_button.${index + 1}`}
        >
          <motion.div
            whileTap={{ scale: 0.75 }}
            className="w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)] flex items-center justify-center transition-smooth"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-white text-xs font-display font-bold drop-shadow-md">
            {formatCount(video.commentCount)}
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
          aria-label="Share video"
          data-ocid={`video_feed.share_button.${index + 1}`}
        >
          <motion.div
            whileTap={{ scale: 0.75 }}
            className="w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)] flex items-center justify-center transition-smooth"
          >
            <Share2 className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-white text-xs font-display font-bold drop-shadow-md">
            {formatCount(video.shareCount)}
          </span>
        </button>

        {/* Gift */}
        <button
          type="button"
          onClick={handleGift}
          className="flex flex-col items-center gap-1 group"
          aria-label="Send gift"
          data-ocid={`video_feed.gift_button.${index + 1}`}
        >
          <motion.div
            whileTap={{ scale: 0.75 }}
            className="w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.72_0.14_68/0.15)] flex items-center justify-center transition-smooth"
          >
            <span className="text-xl">🪙</span>
          </motion.div>
          <span className="text-white text-xs font-display font-bold drop-shadow-md">
            {formatCount(video.giftCount)}
          </span>
        </button>
      </div>

      {/* Bottom info overlay */}
      <div
        className="absolute bottom-0 left-0 right-16 px-4 z-20"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 4px), 64px)" }}
      >
        {/* Creator */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="font-display font-bold text-white text-sm drop-shadow-md">
            @{video.creatorHandle}
          </span>
          {video.isVerified && (
            <BadgeCheck className="w-4 h-4 text-[oklch(0.72_0.2_200)] flex-shrink-0" />
          )}
        </div>

        {/* Caption */}
        <p className="text-white text-sm leading-relaxed mb-2 drop-shadow max-w-[72vw] line-clamp-2 font-body">
          {video.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-2">
          {video.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[oklch(0.72_0.2_200)] text-xs font-body font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Sound ticker */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={isActive && !paused ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Music className="w-3 h-3 text-white/70" />
          </motion.div>
          <span className="text-white/70 text-xs font-body truncate max-w-[55vw]">
            {video.soundName}
          </span>
        </div>

        {/* Gift total */}
        <div className="mt-1.5">
          <CoinBadge amount={video.giftCount} size="sm" showLabel />
        </div>
      </div>

      {/* Modals */}
      <GiftPicker
        videoId={video.id}
        isOpen={showGiftPicker}
        onClose={() => setShowGiftPicker(false)}
      />
      <CommentDrawer
        videoId={video.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}
