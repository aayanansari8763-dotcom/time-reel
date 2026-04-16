import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Camera,
  ChevronRight,
  Grid3X3,
  Heart,
  Play,
  TrendingUp,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AvatarImage } from "../components/AvatarImage";
import { ProfileSkeleton } from "../components/LoadingSkeleton";
import { useFollow, useFollowStatus } from "../hooks/useFollowStatus";
import { useMyProfile, useProfile, useSaveProfile } from "../hooks/useProfile";
import { useSampleVideos } from "../hooks/useSampleVideos";
import type { UserProfile, VideoInfo } from "../types";

interface ProfilePageProps {
  handle: string;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-muted/40 border border-border/50 min-w-[80px]">
      <div className="text-primary">{icon}</div>
      <span className="font-display font-bold text-foreground text-base leading-tight">
        {value}
      </span>
      <span className="text-muted-foreground text-[10px] font-body">
        {label}
      </span>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-display font-bold text-foreground text-lg leading-tight">
        {value}
      </span>
      <span className="text-muted-foreground text-xs font-body">{label}</span>
    </div>
  );
}

function VideoGrid({
  videos,
  emptyLabel,
  emptyCta,
  onEmptyCtaClick,
}: {
  videos: VideoInfo[];
  emptyLabel: string;
  emptyCta?: string;
  onEmptyCtaClick?: () => void;
}) {
  if (videos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-6 gap-4"
        data-ocid="profile.empty_state"
      >
        <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
          <Video className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm font-body text-center">
          {emptyLabel}
        </p>
        {emptyCta && onEmptyCtaClick && (
          <Button
            variant="default"
            size="sm"
            onClick={onEmptyCtaClick}
            className="font-display font-semibold"
            data-ocid="profile.upload_cta_button"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {emptyCta}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5" data-ocid="profile.video_grid">
      {videos.map((video, index) => (
        <motion.button
          key={video.id}
          type="button"
          className="relative aspect-[9/16] overflow-hidden bg-muted cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04 }}
          data-ocid={`profile.video_item.${index + 1}`}
          aria-label={`Play video: ${video.caption}`}
        >
          <img
            src={video.thumbnailUrl}
            alt={video.caption}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
          </div>
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
            <Heart className="w-3 h-3 text-white fill-white" />
            <span className="text-white text-[10px] font-display font-bold">
              {formatCount(video.likeCount)}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

interface EditProfileFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSaved: () => void;
}

function EditProfileForm({ profile, onCancel, onSaved }: EditProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: saveProfile, isPending } = useSaveProfile();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }
    saveProfile(
      { displayName: displayName.trim(), bio: bio.trim() },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
          onSaved();
        },
        onError: () => {
          toast.error("Failed to save profile");
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="px-4 pt-6 pb-8 space-y-5"
      data-ocid="profile.edit_form"
    >
      {/* Avatar upload */}
      <div className="flex justify-center">
        <div className="relative">
          <button
            type="button"
            className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            onClick={() => fileRef.current?.click()}
            aria-label="Change avatar"
            data-ocid="profile.avatar_upload_button"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-background">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="Upload avatar image"
            data-ocid="profile.avatar_input"
          />
        </div>
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="displayName"
          className="font-display font-semibold text-sm"
        >
          Display Name
        </Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          maxLength={50}
          className="bg-muted/30 border-border/60"
          data-ocid="profile.display_name_input"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio" className="font-display font-semibold text-sm">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the world about yourself..."
          maxLength={200}
          rows={3}
          className="bg-muted/30 border-border/60 resize-none"
          data-ocid="profile.bio_textarea"
        />
        <p className="text-muted-foreground text-xs text-right">
          {bio.length}/200
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1 font-display font-semibold"
          onClick={onCancel}
          disabled={isPending}
          data-ocid="profile.edit_cancel_button"
        >
          <X className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>
        <Button
          className="flex-1 font-display font-semibold"
          onClick={handleSave}
          disabled={isPending}
          data-ocid="profile.edit_save_button"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function ProfilePage({ handle }: ProfilePageProps) {
  const navigate = useNavigate();
  const isOwnProfile = handle === "me";
  const resolvedHandle = handle === "me" ? "NeonSkate_Luna" : handle;

  const { data: myProfile, isLoading: myLoading } = useMyProfile();
  const { data: otherProfile, isLoading: otherLoading } = useProfile(
    isOwnProfile ? "" : resolvedHandle,
  );
  const profile = isOwnProfile ? myProfile : otherProfile;
  const isLoading = isOwnProfile ? myLoading : otherLoading;

  const { isFollowing } = useFollowStatus(resolvedHandle);
  const { mutate: follow, isPending: followPending } = useFollow();
  const { isAuthenticated } = useInternetIdentity();
  const isAuth = isAuthenticated;

  const allVideos = useSampleVideos();
  const userVideos = allVideos.filter(
    (v) => v.creatorHandle === resolvedHandle,
  );
  // Show sample liked videos (different subset)
  const likedVideos = isOwnProfile
    ? allVideos.filter((_, i) => i % 3 === 0)
    : [];

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  const effectiveProfile = profile ?? {
    handle: resolvedHandle,
    displayName: resolvedHandle,
    avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${resolvedHandle}&backgroundColor=0a0a1a`,
    bio: "",
    followerCount: 0,
    followingCount: 0,
    videoCount: 0,
    totalLikes: 0,
    isVerified: false,
    coinBalance: 0n,
    joinedAt: Date.now(),
  };

  const isCreator = effectiveProfile.videoCount > 0 || userVideos.length > 0;

  if (isLoading) return <ProfileSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
      data-ocid="profile.page"
    >
      {/* Edit mode */}
      <AnimatePresence mode="wait">
        {editMode && isOwnProfile ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Edit header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border/50">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cancel edit"
                data-ocid="profile.edit_back_button"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display font-bold text-foreground">
                Edit Profile
              </h2>
              <div className="w-5" />
            </div>
            <EditProfileForm
              profile={effectiveProfile}
              onCancel={() => setEditMode(false)}
              onSaved={() => setEditMode(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Profile header */}
            <div className="px-4 pt-6 pb-4 bg-card border-b border-border/40">
              <div className="flex flex-col items-center gap-3">
                {/* Avatar — clickable on own profile to trigger edit */}
                <div className="relative">
                  <button
                    type="button"
                    className={cn(
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
                      isOwnProfile ? "cursor-pointer" : "cursor-default",
                    )}
                    onClick={() => isOwnProfile && setEditMode(true)}
                    aria-label={
                      isOwnProfile
                        ? "Edit avatar"
                        : effectiveProfile.displayName
                    }
                    data-ocid="profile.avatar_button"
                    disabled={!isOwnProfile}
                  >
                    <AvatarImage
                      src={effectiveProfile.avatarUrl}
                      alt={effectiveProfile.displayName}
                      size="xl"
                      ring
                      ringColor="cyan"
                    />
                    {isOwnProfile && (
                      <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                        <Camera className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Name + verified */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <h1 className="font-display font-bold text-foreground text-xl">
                      {effectiveProfile.displayName}
                    </h1>
                    {effectiveProfile.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-body">
                    @{effectiveProfile.handle}
                  </p>
                </div>

                {/* Follower / following / likes stats */}
                <div className="flex items-center gap-6 py-1">
                  <StatBlock
                    value={formatCount(effectiveProfile.followerCount)}
                    label="Followers"
                  />
                  <div className="w-px h-8 bg-border" />
                  <StatBlock
                    value={formatCount(effectiveProfile.followingCount)}
                    label="Following"
                  />
                  <div className="w-px h-8 bg-border" />
                  <StatBlock
                    value={formatCount(effectiveProfile.totalLikes)}
                    label="Likes"
                  />
                </div>

                {/* Bio */}
                {effectiveProfile.bio && (
                  <p className="text-foreground text-sm text-center leading-relaxed max-w-[300px]">
                    {effectiveProfile.bio}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 w-full max-w-[300px]">
                  {isOwnProfile ? (
                    <Button
                      variant="outline"
                      className="flex-1 font-display font-semibold border-border/60 hover:border-primary/50 hover:text-primary transition-smooth"
                      onClick={() => setEditMode(true)}
                      data-ocid="profile.edit_button"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        className={cn(
                          "flex-1 font-display font-semibold transition-smooth",
                          isFollowing
                            ? "bg-muted text-foreground hover:bg-muted/80 border border-border/60"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_oklch(0.65_0.25_259/0.35)]",
                        )}
                        variant={isFollowing ? "outline" : "default"}
                        onClick={() => {
                          if (!isAuth) {
                            toast("Log in to follow creators", { icon: "🔐" });
                            return;
                          }
                          follow({
                            handle: resolvedHandle,
                            currentlyFollowing: isFollowing,
                          });
                        }}
                        disabled={followPending}
                        data-ocid="profile.follow_button"
                      >
                        <Users className="w-4 h-4 mr-1.5" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 font-display font-semibold border-border/60"
                        data-ocid="profile.message_button"
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Creator stats row */}
              <div
                className="flex gap-2 justify-center mt-4 overflow-x-auto pb-1"
                data-ocid="profile.stats_row"
              >
                <StatCard
                  icon={<Video className="w-4 h-4" />}
                  value={formatCount(
                    effectiveProfile.videoCount || userVideos.length,
                  )}
                  label="Videos"
                />
                <StatCard
                  icon={<Heart className="w-4 h-4" />}
                  value={formatCount(effectiveProfile.totalLikes)}
                  label="Total Likes"
                />
                <StatCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  value={formatCount(effectiveProfile.followerCount)}
                  label="Followers"
                />
              </div>

              {/* Earnings teaser for own profile (creator) */}
              {isOwnProfile && isCreator && (
                <motion.button
                  type="button"
                  className="w-full mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 hover:bg-primary/15 transition-smooth"
                  onClick={() => navigate({ to: "/earnings" })}
                  whileTap={{ scale: 0.98 }}
                  data-ocid="profile.creator_dashboard_link"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm">💰</span>
                    </div>
                    <div className="text-left">
                      <p className="font-display font-semibold text-foreground text-sm">
                        Creator Dashboard
                      </p>
                      <p className="text-muted-foreground text-xs font-body">
                        View your earnings & analytics
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.button>
              )}
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="videos"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                className="w-full rounded-none h-11 bg-card border-b border-border/40 grid grid-cols-2 gap-0 p-0"
                data-ocid="profile.tabs"
              >
                <TabsTrigger
                  value="videos"
                  className={cn(
                    "rounded-none font-display font-semibold text-sm h-full border-b-2 transition-smooth",
                    activeTab === "videos"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                  data-ocid="profile.videos_tab"
                >
                  <Grid3X3 className="w-4 h-4 mr-1.5" />
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className={cn(
                    "rounded-none font-display font-semibold text-sm h-full border-b-2 transition-smooth",
                    activeTab === "liked"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                  data-ocid="profile.liked_tab"
                >
                  <Heart className="w-4 h-4 mr-1.5" />
                  Liked
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="videos"
                className="mt-0"
                data-ocid="profile.videos_content"
              >
                <VideoGrid
                  videos={
                    userVideos.length > 0 ? userVideos : allVideos.slice(0, 9)
                  }
                  emptyLabel="No videos posted yet."
                  emptyCta={isOwnProfile ? "Upload Your First Reel" : undefined}
                  onEmptyCtaClick={
                    isOwnProfile ? () => navigate({ to: "/upload" }) : undefined
                  }
                />
              </TabsContent>

              <TabsContent
                value="liked"
                className="mt-0"
                data-ocid="profile.liked_content"
              >
                {isOwnProfile ? (
                  <VideoGrid
                    videos={likedVideos}
                    emptyLabel="Videos you like will appear here."
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-16 gap-3"
                    data-ocid="profile.liked_private_state"
                  >
                    <Heart className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm font-body">
                      Liked videos are private
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
