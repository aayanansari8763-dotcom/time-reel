import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { formatDistanceToNow } from "date-fns";
import { Heart, Send, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  useAddComment,
  useComments,
  useToggleCommentLike,
} from "../hooks/useComments";
import { Skeleton } from "./LoadingSkeleton";

interface CommentDrawerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function CommentDrawer({
  videoId,
  isOpen,
  onClose,
}: CommentDrawerProps) {
  const [text, setText] = useState("");
  // Local optimistic like state: commentId → override (true=liked, false=unliked)
  const [likeOverrides, setLikeOverrides] = useState<Map<string, boolean>>(
    new Map(),
  );

  const { data: comments, isLoading } = useComments(videoId);
  const { mutate: addComment, isPending } = useAddComment(videoId);
  const { mutate: toggleLike } = useToggleCommentLike();
  const { isAuthenticated } = useInternetIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isAuthenticated) return;
    addComment(text.trim());
    setText("");
  };

  const handleLikeToggle = (commentId: string, currentLiked: boolean) => {
    setLikeOverrides((prev) => {
      const next = new Map(prev);
      next.set(commentId, !currentLiked);
      return next;
    });
    toggleLike(commentId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — pointer-events only on the backdrop itself, not the drawer */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-[2px] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl border-t border-white/10 pointer-events-auto"
            style={{
              maxHeight: "78vh",
              background:
                "linear-gradient(180deg, oklch(0.14 0 0 / 0.97) 0%, oklch(0.11 0 0 / 0.99) 100%)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            data-ocid="comment_drawer.dialog"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <h3 className="font-display font-bold text-white text-base">
                {comments?.length ?? 0} Comments
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close comments"
                data-ocid="comment_drawer.close_button"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 min-h-0">
              {isLoading ? (
                ["sk1", "sk2", "sk3"].map((k) => (
                  <div key={k} className="flex gap-3">
                    <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-28 h-3" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-3/4 h-3" />
                    </div>
                  </div>
                ))
              ) : comments?.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-14 text-center"
                  data-ocid="comment_drawer.empty_state"
                >
                  <span className="text-5xl mb-4">💬</span>
                  <p className="font-display font-semibold text-white text-base mb-1">
                    No comments yet
                  </p>
                  <p className="text-white/50 text-sm font-body">
                    Be the first to drop a thought!
                  </p>
                </div>
              ) : (
                comments?.map((comment, index) => {
                  // Resolve effective liked state: local override wins over backend value
                  const effectiveLiked = likeOverrides.has(comment.id)
                    ? (likeOverrides.get(comment.id) ?? false)
                    : (comment.isLiked ?? false);

                  // Adjust like count based on optimistic override
                  const baseCount = comment.likeCount ?? 0;
                  const backendLiked = comment.isLiked ?? false;
                  const likeAdjust = likeOverrides.has(comment.id)
                    ? effectiveLiked === backendLiked
                      ? 0
                      : effectiveLiked
                        ? 1
                        : -1
                    : 0;

                  return (
                    <div
                      key={comment.id}
                      className="flex gap-3 group"
                      data-ocid={`comment_drawer.item.${index + 1}`}
                    >
                      {/* Avatar — generic icon fallback when authorAvatar is absent */}
                      <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-white/10 flex items-center justify-center">
                        {comment.authorAvatar ? (
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorHandle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        ) : (
                          <User className="w-4 h-4 text-white/40" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-display font-bold text-white text-xs">
                            @{comment.authorHandle}
                          </span>
                          <span className="text-white/40 text-[10px] font-body">
                            {formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed break-words font-body">
                          {comment.text}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleLikeToggle(comment.id, effectiveLiked)
                          }
                          className={cn(
                            "flex items-center gap-1 mt-2 text-xs transition-colors",
                            effectiveLiked
                              ? "text-[oklch(0.72_0.2_200)]"
                              : "text-white/40 hover:text-white/70",
                          )}
                          aria-label={
                            effectiveLiked ? "Unlike comment" : "Like comment"
                          }
                          data-ocid={`comment_drawer.toggle.${index + 1}`}
                        >
                          <Heart
                            className={cn(
                              "w-3 h-3 transition-smooth",
                              effectiveLiked && "fill-current",
                            )}
                          />
                          <span>{formatCount(baseCount + likeAdjust)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input area */}
            <div
              className="px-4 py-3 border-t border-white/8 pointer-events-auto"
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom, 4px), 12px)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/8 border-white/12 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.72_0.2_200)] focus-visible:border-[oklch(0.72_0.2_200)] pointer-events-auto"
                    style={{ pointerEvents: "auto" }}
                    maxLength={300}
                    autoFocus={isOpen}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    data-ocid="comment_drawer.input"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!text.trim() || isPending}
                    className="bg-[oklch(0.72_0.2_200)] hover:bg-[oklch(0.68_0.22_200)] text-[oklch(0.05_0_0)] flex-shrink-0"
                    data-ocid="comment_drawer.submit_button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <p className="text-center text-white/50 text-sm py-2 font-body">
                  Log in to leave a comment
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
