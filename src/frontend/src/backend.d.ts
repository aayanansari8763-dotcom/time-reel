import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: VideoId;
    title: string;
    likeCount: bigint;
    expiresAt?: Timestamp;
    giftCount: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    trendingScore: number;
    description: string;
    uploaderHandle: string;
    videoBlob: ExternalBlob;
    thumbnailBlob: ExternalBlob;
    shareCount: bigint;
    viewCount: bigint;
    commentCount: bigint;
    category: string;
    uploaderId: UserId;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SaveProfileArgs {
    bio: string;
    displayName: string;
    avatarBlob?: ExternalBlob;
    handle: string;
}
export interface Gift {
    id: GiftId;
    coinValue: bigint;
    createdAt: Timestamp;
    giftEmoji: string;
    receiverPrincipal: UserId;
    senderPrincipal: UserId;
    videoId: VideoId;
}
export interface CommentWithContext {
    id: CommentId;
    isLiked: boolean;
    likeCount: bigint;
    authorAvatar: string;
    createdAt: Timestamp;
    text: string;
    authorHandle: string;
    videoId: VideoId;
}
export type TransactionId = string;
export interface CoinTransaction {
    id: TransactionId;
    transactionType: TransactionType;
    createdAt: Timestamp;
    referenceId: string;
    userPrincipal: UserId;
    amount: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type VideoId = string;
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CreateVideoArgs {
    title: string;
    tags: Array<string>;
    description: string;
    videoBlob: ExternalBlob;
    thumbnailBlob: ExternalBlob;
    category: string;
}
export type GiftId = string;
export type CommentId = string;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface CoinPack {
    id: string;
    displayName: string;
    coins: bigint;
    priceInCents: bigint;
}
export interface UserProfile {
    bio: string;
    principal: UserId;
    displayName: string;
    avatarBlob?: ExternalBlob;
    coinBalance: bigint;
    joinedAt: Timestamp;
    totalLikes: bigint;
    totalVideos: bigint;
    followerCount: bigint;
    handle: string;
    followingCount: bigint;
    totalCoinsEarned: bigint;
}
export enum GiftType {
    heart = "heart",
    rose = "rose",
    crown = "crown",
    diamond = "diamond",
    rocket = "rocket"
}
export enum TransactionType {
    gift_sent = "gift_sent",
    gift_received = "gift_received",
    purchase = "purchase"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(videoId: VideoId, text: string): Promise<CommentWithContext>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createVideo(args: CreateVideoArgs): Promise<Video>;
    deleteComment(videoId: VideoId, commentId: CommentId): Promise<void>;
    deleteVideo(videoId: VideoId): Promise<void>;
    editVideo(videoId: VideoId, title: string, description: string, tags: Array<string>, category: string): Promise<Video>;
    followUser(target: UserId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoinBalance(): Promise<bigint>;
    getCoinPacks(): Promise<Array<CoinPack>>;
    getCoinTransactions(): Promise<Array<CoinTransaction>>;
    getComments(videoId: VideoId): Promise<Array<CommentWithContext>>;
    getCreatorEarnings(): Promise<{
        totalCoins: bigint;
        recentGifts: Array<Gift>;
    }>;
    getMyProfile(): Promise<UserProfile>;
    getProfile(userId: UserId): Promise<UserProfile | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTrendingVideos(category: string | null, limit: bigint): Promise<Array<Video>>;
    getVideo(videoId: VideoId): Promise<Video | null>;
    getVideos(category: string | null, cursor: bigint | null, limit: bigint): Promise<Array<Video>>;
    incrementShare(videoId: VideoId): Promise<void>;
    incrementView(videoId: VideoId): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    likeComment(videoId: VideoId, commentId: CommentId): Promise<void>;
    likeVideo(videoId: VideoId): Promise<void>;
    purchaseCoins(packId: string, sessionId: string): Promise<CoinTransaction>;
    saveCallerUserProfile(args: SaveProfileArgs): Promise<UserProfile>;
    sendGift(videoId: VideoId, giftType: GiftType): Promise<Gift>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unfollowUser(target: UserId): Promise<void>;
    unlikeComment(videoId: VideoId, commentId: CommentId): Promise<void>;
    unlikeVideo(videoId: VideoId): Promise<void>;
}
