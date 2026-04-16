export interface VideoInfo {
  id: string;
  creatorHandle: string;
  creatorAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  soundName: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  giftCount: number;
  isLiked: boolean;
  createdAt: number;
  duration: number;
  isVerified: boolean;
}

export interface UserProfile {
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  videoCount: number;
  totalLikes: number;
  isVerified: boolean;
  coinBalance: bigint;
  joinedAt: number;
}

export interface Comment {
  id: string;
  videoId: string;
  authorHandle: string;
  authorAvatar?: string; // optional — backend doesn't provide this field yet
  text: string;
  likeCount: number; // defaults to 0 when backend omits it
  createdAt: number;
  isLiked: boolean; // defaults to false when backend omits it
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  coinCost: number;
  animationClass: string;
}

export interface CoinTransaction {
  id: string;
  type: "purchase" | "gift_sent" | "gift_received" | "withdrawal";
  amount: number;
  description: string;
  createdAt: number;
  targetHandle?: string;
}

export interface CoinPack {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

export interface CreatorEarnings {
  totalEarned: number;
  pendingPayout: number;
  lastPayoutAmount: number;
  lastPayoutDate: number;
  giftBreakdown: { giftName: string; count: number; coins: number }[];
}
