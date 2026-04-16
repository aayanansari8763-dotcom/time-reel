import type { VideoInfo } from "../types";

const SAMPLE_VIDEOS: VideoInfo[] = [
  {
    id: "v1",
    creatorHandle: "NeonSkate_Luna",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    caption: "Flowing through the cyber-streets. Night vibes only. 🛹✨",
    hashtags: ["TimeReel", "FutureSkate", "CyberpunkCity"],
    soundName: "Synthwave Dreams - Original Sound",
    likeCount: 1200000,
    commentCount: 15800,
    shareCount: 345000,
    viewCount: 8400000,
    giftCount: 4100,
    isLiked: false,
    createdAt: Date.now() - 86400000 * 2,
    duration: 47,
    isVerified: true,
  },
  {
    id: "v2",
    creatorHandle: "CyberDance_Zara",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Zara&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&q=80",
    caption:
      "AI choreography meets human rhythm 🤖💃 This is the future of dance!",
    hashtags: ["AIGenerated", "FutureDance", "TimeReel"],
    soundName: "Neural Beats Vol.3",
    likeCount: 892000,
    commentCount: 9400,
    shareCount: 210000,
    viewCount: 5200000,
    giftCount: 2800,
    isLiked: true,
    createdAt: Date.now() - 86400000 * 1,
    duration: 32,
    isVerified: true,
  },
  {
    id: "v3",
    creatorHandle: "PixelChef_Kai",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Kai&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    caption:
      "3-star meal in 60 seconds 🍣⚡ Molecular gastronomy for the algorithm generation",
    hashtags: ["FoodPorn", "NeonKitchen", "TechCooking"],
    soundName: "Tokyo Kitchen Beats",
    likeCount: 445000,
    commentCount: 7200,
    shareCount: 98000,
    viewCount: 3100000,
    giftCount: 1200,
    isLiked: false,
    createdAt: Date.now() - 86400000 * 3,
    duration: 61,
    isVerified: false,
  },
  {
    id: "v4",
    creatorHandle: "VoidArt_Rex",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Rex&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
    caption:
      "Painted this in AR space while skydiving at 15,000ft 🎨🪂 Art has no limits",
    hashtags: ["ARPainting", "ExtremArt", "FutureCanvas"],
    soundName: "Zero Gravity Mix",
    likeCount: 2100000,
    commentCount: 31000,
    shareCount: 780000,
    viewCount: 14600000,
    giftCount: 8900,
    isLiked: false,
    createdAt: Date.now() - 3600000 * 6,
    duration: 28,
    isVerified: true,
  },
  {
    id: "v5",
    creatorHandle: "NanoBot_Suki",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Suki&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&q=80",
    caption:
      "Training my AI companion for 6 months. Today it composed its first song 🎵🤖 Proud creator moment",
    hashtags: ["AIMusic", "DigitalPet", "FutureTech"],
    soundName: "AI Composed - NanoBot Original",
    likeCount: 678000,
    commentCount: 12100,
    shareCount: 156000,
    viewCount: 4300000,
    giftCount: 3400,
    isLiked: false,
    createdAt: Date.now() - 86400000 * 5,
    duration: 55,
    isVerified: false,
  },
  {
    id: "v6",
    creatorHandle: "QuantumFit_Mira",
    creatorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Mira&backgroundColor=0a0a1a",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    caption:
      "Levitation yoga at 5AM with holo-projection. Mind over matter 🧘‍♀️🔮",
    hashtags: ["FutureYoga", "LevitationTech", "MindBody"],
    soundName: "Quantum Frequencies - 528hz",
    likeCount: 334000,
    commentCount: 5600,
    shareCount: 67000,
    viewCount: 2800000,
    giftCount: 990,
    isLiked: false,
    createdAt: Date.now() - 86400000 * 7,
    duration: 43,
    isVerified: true,
  },
];

export function useSampleVideos(): VideoInfo[] {
  return SAMPLE_VIDEOS;
}

export function useSampleTrendingVideos(): VideoInfo[] {
  return [...SAMPLE_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
}

export { SAMPLE_VIDEOS };
