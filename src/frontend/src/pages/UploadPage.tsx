import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Tag,
  Upload,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, createActor } from "../backend";

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Music",
  "Comedy",
  "Dance",
  "Food",
  "Travel",
  "Sports",
  "Tech",
  "Other",
] as const;

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_TITLE_LEN = 100;
const MAX_DESC_LEN = 500;

// Minimal 1×1 transparent PNG bytes
const BLANK_PNG = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0,
  0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 8,
  215, 99, 248, 207, 192, 0, 0, 0, 2, 0, 1, 226, 33, 188, 51, 0, 0, 0, 0, 73,
  69, 78, 68, 174, 66, 96, 130,
]);

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface UploadFormData {
  title: string;
  description: string;
  tags: string[];
  tagInput: string;
  category: string;
}

// ─── Step indicator ─────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  const steps = [1, 2, 3] as const;
  return (
    <div
      className="flex items-center justify-center gap-3 mb-6"
      aria-label="Upload steps"
    >
      {steps.map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold transition-smooth",
              s === current
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_oklch(var(--primary)/0.5)]"
                : s < current
                  ? "bg-primary/30 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
            data-ocid={`upload.step_dot.${s}`}
          >
            {s < current ? <CheckCircle className="w-4 h-4" /> : s}
          </div>
          {s < 3 && (
            <div
              className={cn(
                "w-10 h-0.5 rounded-full transition-smooth",
                s < current ? "bg-primary/60" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────

function UploadProgressBar({
  progress,
  onCancel,
}: {
  progress: number;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2" data-ocid="upload.loading_state">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-body">
          Uploading video…
        </span>
        <span className="text-primary font-display font-bold">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ boxShadow: "0 0 8px oklch(var(--primary)/0.6)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="w-full text-destructive hover:text-destructive gap-2 mt-1"
        data-ocid="upload.cancel_button"
      >
        <XCircle className="w-4 h-4" />
        Cancel Upload
      </Button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function UploadPage() {
  const { isAuthenticated, login } = useInternetIdentity();
  const { actor } = useActor(createActor);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(1);

  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [form, setForm] = useState<UploadFormData>({
    title: "",
    description: "",
    tags: [],
    tagInput: "",
    category: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const cancelRef = useRef(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // ─── File handlers ───────────────────────────────────────────────────────

  const handleVideoFile = (f: File) => {
    if (!f.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (f.size > MAX_VIDEO_SIZE) {
      toast.error("Video must be under 100 MB");
      return;
    }
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(f);
    setVideoPreviewUrl(URL.createObjectURL(f));
    setErrors((e) => ({ ...e, video: undefined }));
  };

  const handleThumbnailFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file for the thumbnail");
      return;
    }
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailFile(f);
    setThumbnailPreviewUrl(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleVideoFile(f);
  };

  // ─── Tag handlers ─────────────────────────────────────────────────────────

  const addTag = () => {
    const raw = form.tagInput.trim().replace(/^#/, "");
    if (!raw || form.tags.includes(raw) || form.tags.length >= 10) return;
    setForm((f) => ({ ...f, tags: [...f.tags, raw], tagInput: "" }));
  };

  const removeTag = (t: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // ─── Validation ──────────────────────────────────────────────────────────

  const validateStep1 = () => {
    if (!videoFile) {
      setErrors({ video: "Please select a video file" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category) errs.category = "Please select a category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Navigation ──────────────────────────────────────────────────────────

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, 3) as Step);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1) as Step);

  // ─── Publish ─────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!videoFile || !actor) return;
    cancelRef.current = false;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
      const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
        (pct) => {
          if (!cancelRef.current) setUploadProgress(pct * 0.9);
        },
      );

      let thumbBlob: ExternalBlob;
      if (thumbnailFile) {
        const thumbBytes = new Uint8Array(await thumbnailFile.arrayBuffer());
        thumbBlob = ExternalBlob.fromBytes(thumbBytes).withUploadProgress(
          (pct) => {
            if (!cancelRef.current) setUploadProgress(90 + pct * 0.1);
          },
        );
      } else {
        thumbBlob = ExternalBlob.fromBytes(BLANK_PNG);
      }

      if (cancelRef.current) {
        setIsUploading(false);
        return;
      }

      await actor.createVideo({
        title: form.title,
        description: form.description,
        tags: form.tags,
        category: form.category,
        videoBlob,
        thumbnailBlob: thumbBlob,
      });

      setUploadProgress(100);
      setUploadDone(true);

      // Invalidate feed and profile caches so new video appears immediately
      await queryClient.invalidateQueries({ queryKey: ["videos"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      if (!cancelRef.current) {
        toast.error("Upload failed. Please try again.");
        console.error(err);
      }
    } finally {
      if (!cancelRef.current) setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    cancelRef.current = true;
    setIsUploading(false);
    setUploadProgress(0);
    toast("Upload cancelled");
  };

  const resetAll = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setForm({
      title: "",
      description: "",
      tags: [],
      tagInput: "",
      category: "",
    });
    setErrors({});
    setStep(1);
    setUploadDone(false);
    setUploadProgress(0);
  };

  // ─── Unauthenticated gate ────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center bg-background"
        data-ocid="upload.auth_gate"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_32px_oklch(var(--primary)/0.2)]">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-2xl">
              Sign in to upload
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-[260px] mx-auto leading-relaxed">
              Create your account to start sharing videos with the Time Reel
              community
            </p>
          </div>
          <Button
            onClick={login}
            className="mt-2 font-display font-bold px-8 h-12"
            data-ocid="upload.login_button"
          >
            Sign in with Internet Identity
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Success state ───────────────────────────────────────────────────────

  if (uploadDone) {
    return (
      <div
        className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center"
        data-ocid="upload.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_40px_oklch(var(--primary)/0.3)]">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-2xl">
              Your video is live! 🎉
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              &ldquo;{form.title}&rdquo; has been published to Time Reel
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={resetAll}
              className="font-display font-semibold"
              data-ocid="upload.upload_another_button"
            >
              Upload Another
            </Button>
            <Button
              onClick={() => navigate({ to: "/feed" })}
              className="font-display font-bold"
              data-ocid="upload.view_feed_button"
            >
              View Feed
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Upload page ─────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-64px)] bg-background px-4 py-6 max-w-lg mx-auto pb-24"
      data-ocid="upload.page"
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display font-bold text-foreground text-2xl">
          Upload Video
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Share your moment with the world
        </p>
      </div>

      <StepDots current={step} />

      <AnimatePresence mode="wait">
        {/* ─── STEP 1: Select Video ─────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-1">
                Select your video
              </h2>
              <p className="text-muted-foreground text-sm">
                MP4, MOV, WebM — max 100 MB
              </p>
            </div>

            {/* Drop zone */}
            {!videoFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl overflow-hidden transition-smooth",
                  isDragging
                    ? "border-primary bg-primary/5 shadow-[0_0_24px_oklch(var(--primary)/0.15)]"
                    : "border-border",
                  errors.video && "border-destructive/60",
                )}
                data-ocid="upload.dropzone"
              >
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  aria-label="Drop video here or click to select"
                  className="w-full p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/20 transition-smooth"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-smooth",
                      isDragging ? "bg-primary/20" : "bg-muted/50",
                    )}
                  >
                    <Video
                      className={cn(
                        "w-8 h-8 transition-smooth",
                        isDragging ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-foreground">
                      Drop your video here
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      or click to select a file
                    </p>
                    <p className="text-muted-foreground text-xs mt-2 opacity-70">
                      Supports: MP4, MOV, WebM, AVI — max 100 MB
                    </p>
                  </div>
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleVideoFile(e.target.files[0])
                  }
                  data-ocid="upload.video_input"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Video preview */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[52vh]">
                  <video
                    src={videoPreviewUrl ?? undefined}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                      setVideoFile(null);
                      setVideoPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-smooth"
                    aria-label="Remove video"
                    data-ocid="upload.remove_video_button"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                {/* File info */}
                <div className="bg-muted/30 rounded-xl px-4 py-3 flex items-center gap-3 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-foreground text-sm truncate">
                      {videoFile.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.video && (
              <p
                className="text-destructive text-sm"
                data-ocid="upload.video_field_error"
              >
                {errors.video}
              </p>
            )}

            {/* Custom thumbnail */}
            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Custom Thumbnail
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </Label>
              {thumbnailPreviewUrl ? (
                <div className="relative rounded-xl overflow-hidden h-24 bg-muted/30">
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (thumbnailPreviewUrl)
                        URL.revokeObjectURL(thumbnailPreviewUrl);
                      setThumbnailFile(null);
                      setThumbnailPreviewUrl(null);
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center"
                    aria-label="Remove thumbnail"
                    data-ocid="upload.remove_thumbnail_button"
                  >
                    <X className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="w-full border border-dashed border-border rounded-xl py-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-smooth text-sm"
                  data-ocid="upload.thumbnail_upload_button"
                >
                  <Upload className="w-4 h-4" />
                  Upload thumbnail image
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleThumbnailFile(e.target.files[0])
                    }
                  />
                </button>
              )}
            </div>

            <Button
              onClick={goNext}
              disabled={!videoFile}
              className="w-full font-display font-bold h-12"
              data-ocid="upload.step1_next_button"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* ─── STEP 2: Add Details ──────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-1">
                Add details
              </h2>
              <p className="text-muted-foreground text-sm">
                Help people discover your video
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="font-display font-semibold text-foreground text-sm"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value.slice(0, MAX_TITLE_LEN),
                  }))
                }
                placeholder="What's your video about?"
                className={cn(
                  "bg-muted/30 border-border",
                  errors.title && "border-destructive/60",
                )}
                maxLength={MAX_TITLE_LEN}
                data-ocid="upload.title_input"
              />
              <div className="flex justify-between items-center">
                {errors.title ? (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="upload.title_field_error"
                  >
                    {errors.title}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-muted-foreground text-xs text-right">
                  {form.title.length}/{MAX_TITLE_LEN}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="font-display font-semibold text-foreground text-sm"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value.slice(0, MAX_DESC_LEN),
                  }))
                }
                placeholder="Tell your story, add context, mention collaborators..."
                className="bg-muted/30 border-border resize-none"
                rows={3}
                maxLength={MAX_DESC_LEN}
                data-ocid="upload.description_textarea"
              />
              <p className="text-muted-foreground text-xs text-right">
                {form.description.length}/{MAX_DESC_LEN}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="font-display font-semibold text-foreground text-sm flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={form.tagInput}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tagInput: e.target.value }))
                  }
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag, press Enter or comma"
                  className="bg-muted/30 border-border flex-1"
                  data-ocid="upload.tags_input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={!form.tagInput.trim()}
                  className="shrink-0"
                  data-ocid="upload.add_tag_button"
                >
                  Add
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="gap-1 font-body cursor-pointer hover:bg-destructive/20 transition-smooth"
                      onClick={() => removeTag(t)}
                      data-ocid="upload.tag_chip"
                    >
                      #{t}
                      <X className="w-3 h-3 opacity-60" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="font-display font-semibold text-foreground text-sm"
              >
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(val) => {
                  setForm((f) => ({ ...f, category: val }));
                  setErrors((e) => ({ ...e, category: undefined }));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "bg-muted/30 border-border",
                    errors.category && "border-destructive/60",
                  )}
                  data-ocid="upload.category_select"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="upload.category_field_error"
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="flex-1 font-display font-semibold h-12"
                data-ocid="upload.step2_back_button"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                type="button"
                onClick={goNext}
                className="flex-1 font-display font-bold h-12"
                data-ocid="upload.step2_next_button"
              >
                Preview
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: Preview & Publish ────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-1">
                Preview &amp; publish
              </h2>
              <p className="text-muted-foreground text-sm">
                Looks good? Hit Publish!
              </p>
            </div>

            {/* Preview card */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              {/* Thumbnail / video frame */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {thumbnailPreviewUrl ? (
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                {/* Category badge overlay */}
                {form.category && (
                  <div className="absolute top-2 left-2">
                    <Badge className="font-display text-xs bg-primary/90 text-primary-foreground">
                      {form.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <p className="font-display font-bold text-foreground text-base leading-snug">
                  {form.title || (
                    <span className="text-muted-foreground italic">
                      No title
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm font-body">@you</p>
                {form.description && (
                  <p className="text-foreground/80 text-sm font-body line-clamp-2">
                    {form.description}
                  </p>
                )}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="text-primary text-xs font-body font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video file info */}
            <div className="bg-muted/20 rounded-xl px-4 py-3 flex items-center gap-3 border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-foreground text-sm truncate">
                  {videoFile?.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {videoFile
                    ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB`
                    : ""}
                </p>
              </div>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <UploadProgressBar
                progress={uploadProgress}
                onCancel={cancelUpload}
              />
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isUploading}
                className="flex-1 font-display font-semibold h-12"
                data-ocid="upload.step3_back_button"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isUploading || !actor}
                className="flex-1 font-display font-bold h-12 gap-2"
                data-ocid="upload.publish_button"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Publish 🚀
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
