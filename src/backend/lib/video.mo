import Map "mo:core/Map";
import Set "mo:core/Set";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import VideoTypes "../types/video";

module {
  public type VideoStore = Map.Map<Common.VideoId, VideoTypes.Video>;
  public type LikeStore = Map.Map<Common.VideoId, Set.Set<Common.UserId>>;

  // Trending score = (likes + comments*2 + shares*3 + gifts*5) / (hoursSince + 2)^1.5
  func computeTrendingScore(video : VideoTypes.Video) : Float {
    let nowNs : Int = Time.now();
    let createdNs : Int = video.createdAt;
    let diffNs : Int = if (nowNs > createdNs) { nowNs - createdNs } else { 0 };
    let hoursSince : Float = diffNs.toFloat() / 3_600_000_000_000.0;
    let engagement : Float = video.likeCount.toFloat()
      + video.commentCount.toFloat() * 2.0
      + video.shareCount.toFloat() * 3.0
      + video.giftCount.toFloat() * 5.0;
    let denominator : Float = Float.pow(hoursSince + 2.0, 1.5);
    engagement / denominator;
  };

  public func getVideos(
    store : VideoStore,
    category : ?Text,
    cursor : ?Nat,
    limit : Nat,
  ) : [VideoTypes.Video] {
    let all = store.entries()
      .filter(func((_, v)) {
        switch (category) {
          case (null) { true };
          case (?cat) { v.category == cat };
        }
      })
      .map(func((_, v)) { v })
      .toArray();
    // sort by id numerically (newest first by insertion order approximation)
    let sorted = all.sort(func(a, b) {
      // compare ids as text — fallback to creation time
      Int.compare(b.createdAt, a.createdAt)
    });
    let start = switch (cursor) {
      case (null) { 0 };
      case (?c) { c };
    };
    sorted.sliceToArray(start, start + limit);
  };

  public func getTrendingVideos(
    store : VideoStore,
    category : ?Text,
    limit : Nat,
  ) : [VideoTypes.Video] {
    let all = store.entries()
      .filter(func((_, v)) {
        switch (category) {
          case (null) { true };
          case (?cat) { v.category == cat };
        }
      })
      .map(func((_, v)) { v })
      .toArray();
    let sorted = all.sort(func(a, b) {
      // higher trendingScore first
      if (a.trendingScore > b.trendingScore) { #less }
      else if (a.trendingScore < b.trendingScore) { #greater }
      else { #equal }
    });
    sorted.sliceToArray(0, limit);
  };

  public func getVideo(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : ?VideoTypes.Video {
    store.get(videoId);
  };

  public func createVideo(
    store : VideoStore,
    caller : Common.UserId,
    uploaderHandle : Text,
    args : VideoTypes.CreateVideoArgs,
    nextId : Nat,
  ) : VideoTypes.Video {
    let videoId = nextId.toText();
    let now = Time.now();
    let video : VideoTypes.Video = {
      id = videoId;
      uploaderId = caller;
      uploaderHandle;
      title = args.title;
      description = args.description;
      tags = args.tags;
      category = args.category;
      videoBlob = args.videoBlob;
      thumbnailBlob = args.thumbnailBlob;
      likeCount = 0;
      commentCount = 0;
      shareCount = 0;
      giftCount = 0;
      viewCount = 0;
      trendingScore = 0.0;
      createdAt = now;
      expiresAt = null;
    };
    store.add(videoId, video);
    video;
  };

  public func editVideo(
    store : VideoStore,
    caller : Common.UserId,
    videoId : Common.VideoId,
    title : Text,
    description : Text,
    tags : [Text],
    category : Text,
  ) : VideoTypes.Video {
    let existing = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    if (not Principal.equal(existing.uploaderId, caller)) {
      Runtime.trap("Unauthorized: not your video");
    };
    let updated : VideoTypes.Video = { existing with title; description; tags; category };
    store.add(videoId, updated);
    updated;
  };

  public func deleteVideo(
    store : VideoStore,
    caller : Common.UserId,
    videoId : Common.VideoId,
  ) : () {
    let existing = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    if (not Principal.equal(existing.uploaderId, caller)) {
      Runtime.trap("Unauthorized: not your video");
    };
    store.remove(videoId);
  };

  public func likeVideo(
    store : VideoStore,
    likeStore : LikeStore,
    caller : Common.UserId,
    videoId : Common.VideoId,
  ) : () {
    let video = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    let likers = switch (likeStore.get(videoId)) {
      case (null) {
        let s = Set.empty<Common.UserId>();
        likeStore.add(videoId, s);
        s;
      };
      case (?s) { s };
    };
    if (likers.contains(caller)) {
      Runtime.trap("Already liked");
    };
    likers.add(caller);
    let updated : VideoTypes.Video = { video with likeCount = video.likeCount + 1 };
    store.add(videoId, updated);
    recalculateTrendingScore(store, videoId);
  };

  public func unlikeVideo(
    store : VideoStore,
    likeStore : LikeStore,
    caller : Common.UserId,
    videoId : Common.VideoId,
  ) : () {
    let video = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    let likers = switch (likeStore.get(videoId)) {
      case (null) { Runtime.trap("Not liked") };
      case (?s) { s };
    };
    if (not likers.contains(caller)) {
      Runtime.trap("Not liked");
    };
    likers.remove(caller);
    let newCount = if (video.likeCount > 0) { video.likeCount - 1 } else { 0 };
    let updated : VideoTypes.Video = { video with likeCount = newCount };
    store.add(videoId, updated);
    recalculateTrendingScore(store, videoId);
  };

  public func incrementShare(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let updated : VideoTypes.Video = { video with shareCount = video.shareCount + 1 };
        store.add(videoId, updated);
        recalculateTrendingScore(store, videoId);
      };
    };
  };

  public func incrementView(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let updated : VideoTypes.Video = { video with viewCount = video.viewCount + 1 };
        store.add(videoId, updated);
      };
    };
  };

  public func incrementGiftCount(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let updated : VideoTypes.Video = { video with giftCount = video.giftCount + 1 };
        store.add(videoId, updated);
        recalculateTrendingScore(store, videoId);
      };
    };
  };

  public func incrementCommentCount(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let updated : VideoTypes.Video = { video with commentCount = video.commentCount + 1 };
        store.add(videoId, updated);
        recalculateTrendingScore(store, videoId);
      };
    };
  };

  public func decrementCommentCount(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let newCount = if (video.commentCount > 0) { video.commentCount - 1 } else { 0 };
        let updated : VideoTypes.Video = { video with commentCount = newCount };
        store.add(videoId, updated);
      };
    };
  };

  public func recalculateTrendingScore(
    store : VideoStore,
    videoId : Common.VideoId,
  ) : () {
    switch (store.get(videoId)) {
      case (null) {};
      case (?video) {
        let score = computeTrendingScore(video);
        let updated : VideoTypes.Video = { video with trendingScore = score };
        store.add(videoId, updated);
      };
    };
  };
};
