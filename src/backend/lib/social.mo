import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import SocialTypes "../types/social";

module {
  public type CommentStore = Map.Map<Common.VideoId, List.List<SocialTypes.Comment>>;
  public type GiftStore = Map.Map<Common.GiftId, SocialTypes.Gift>;
  // Maps CommentId -> Set of Principals who liked that comment
  public type CommentLikesStore = Map.Map<Common.CommentId, Set.Set<Common.UserId>>;

  public func getComments(
    store : CommentStore,
    likesStore : CommentLikesStore,
    videoId : Common.VideoId,
    caller : Common.UserId,
  ) : [SocialTypes.CommentWithContext] {
    let comments = switch (store.get(videoId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
    comments.map<SocialTypes.Comment, SocialTypes.CommentWithContext>(func(c) {
      let likers = switch (likesStore.get(c.id)) {
        case (null) { Set.empty<Common.UserId>() };
        case (?s) { s };
      };
      let isLiked = likers.contains(caller);
      {
        id = c.id;
        videoId = c.videoId;
        authorHandle = c.authorHandle;
        authorAvatar = c.authorAvatar;
        text = c.text;
        likeCount = c.likeCount;
        createdAt = c.createdAt;
        isLiked;
      };
    });
  };

  public func addComment(
    store : CommentStore,
    caller : Common.UserId,
    authorHandle : Text,
    authorAvatar : Text,
    videoId : Common.VideoId,
    text : Text,
    nextId : Nat,
  ) : SocialTypes.Comment {
    let comment : SocialTypes.Comment = {
      id = nextId.toText();
      videoId;
      authorPrincipal = caller;
      authorHandle;
      authorAvatar;
      text;
      likeCount = 0;
      createdAt = Time.now();
    };
    let list = switch (store.get(videoId)) {
      case (null) {
        let l = List.empty<SocialTypes.Comment>();
        store.add(videoId, l);
        l;
      };
      case (?l) { l };
    };
    list.add(comment);
    comment;
  };

  public func deleteComment(
    store : CommentStore,
    caller : Common.UserId,
    videoId : Common.VideoId,
    commentId : Common.CommentId,
  ) : () {
    let list = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?l) { l };
    };
    let found = list.find(func(c) = c.id == commentId);
    switch (found) {
      case (null) { Runtime.trap("Comment not found") };
      case (?c) {
        if (not Principal.equal(c.authorPrincipal, caller)) {
          Runtime.trap("Unauthorized: not your comment");
        };
      };
    };
    let kept = list.filter(func(c) = c.id != commentId);
    list.clear();
    list.append(kept);
  };

  public func likeComment(
    store : CommentStore,
    likesStore : CommentLikesStore,
    videoId : Common.VideoId,
    commentId : Common.CommentId,
    caller : Common.UserId,
  ) : () {
    let list = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?l) { l };
    };
    let found = list.find(func(c) = c.id == commentId);
    switch (found) {
      case (null) { Runtime.trap("Comment not found") };
      case (?_) {};
    };
    // Track like in likesStore
    let likers = switch (likesStore.get(commentId)) {
      case (null) {
        let s = Set.empty<Common.UserId>();
        likesStore.add(commentId, s);
        s;
      };
      case (?s) { s };
    };
    if (likers.contains(caller)) {
      return; // already liked — idempotent
    };
    likers.add(caller);
    // Increment likeCount on the comment record
    list.mapInPlace(func(c) {
      if (c.id == commentId) { { c with likeCount = c.likeCount + 1 } } else { c };
    });
  };

  public func unlikeComment(
    store : CommentStore,
    likesStore : CommentLikesStore,
    videoId : Common.VideoId,
    commentId : Common.CommentId,
    caller : Common.UserId,
  ) : () {
    let list = switch (store.get(videoId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?l) { l };
    };
    let found = list.find(func(c) = c.id == commentId);
    switch (found) {
      case (null) { Runtime.trap("Comment not found") };
      case (?_) {};
    };
    let likers = switch (likesStore.get(commentId)) {
      case (null) { return }; // never liked — idempotent
      case (?s) { s };
    };
    if (not likers.contains(caller)) {
      return; // not liked — idempotent
    };
    likers.remove(caller);
    // Decrement likeCount (guard against underflow)
    list.mapInPlace(func(c) {
      if (c.id == commentId) {
        let newCount = if (c.likeCount > 0) { c.likeCount - 1 } else { 0 };
        { c with likeCount = newCount };
      } else { c };
    });
  };

  public func sendGift(
    giftStore : GiftStore,
    caller : Common.UserId,
    receiverPrincipal : Common.UserId,
    videoId : Common.VideoId,
    giftType : SocialTypes.GiftType,
    nextId : Nat,
  ) : SocialTypes.Gift {
    let giftId = nextId.toText();
    let gift : SocialTypes.Gift = {
      id = giftId;
      videoId;
      senderPrincipal = caller;
      receiverPrincipal;
      giftEmoji = getGiftEmoji(giftType);
      coinValue = getGiftCoinValue(giftType);
      createdAt = Time.now();
    };
    giftStore.add(giftId, gift);
    gift;
  };

  public func getGiftCoinValue(giftType : SocialTypes.GiftType) : Nat {
    switch (giftType) {
      case (#rose) { 1 };
      case (#heart) { 5 };
      case (#crown) { 10 };
      case (#diamond) { 50 };
      case (#rocket) { 100 };
    };
  };

  public func getGiftEmoji(giftType : SocialTypes.GiftType) : Text {
    switch (giftType) {
      case (#rose) { "🌹" };
      case (#heart) { "💕" };
      case (#crown) { "👑" };
      case (#diamond) { "💎" };
      case (#rocket) { "🚀" };
    };
  };
};
