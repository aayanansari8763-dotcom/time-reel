import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import SocialTypes "../types/social";
import SocialLib "../lib/social";
import UserLib "../lib/user";
import VideoLib "../lib/video";
import CoinLib "../lib/coins";

mixin (
  accessControlState : AccessControl.AccessControlState,
  commentStore : SocialLib.CommentStore,
  commentLikesStore : SocialLib.CommentLikesStore,
  giftStore : SocialLib.GiftStore,
  profileStore : UserLib.ProfileStore,
  videoStore : VideoLib.VideoStore,
  coinBalanceStore : CoinLib.BalanceStore,
  coinTxStore : CoinLib.TransactionStore,
) {
  var nextCommentId : Nat = 0;
  var nextGiftId : Nat = 0;
  var nextSocialCoinTxId : Nat = 0;

  public shared ({ caller }) func getComments(videoId : Common.VideoId) : async [SocialTypes.CommentWithContext] {
    SocialLib.getComments(commentStore, commentLikesStore, videoId, caller);
  };

  public shared ({ caller }) func addComment(videoId : Common.VideoId, text : Text) : async SocialTypes.CommentWithContext {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let profile = UserLib.getOrInitProfile(profileStore, caller);
    // avatarBlob is binary; pass empty string so frontend uses its default avatar placeholder
    let avatarUrl : Text = "";
    let comment = SocialLib.addComment(commentStore, caller, profile.handle, avatarUrl, videoId, text, nextCommentId);
    nextCommentId += 1;
    VideoLib.incrementCommentCount(videoStore, videoId);
    // Return as CommentWithContext (newly added comment is not liked yet)
    {
      id = comment.id;
      videoId = comment.videoId;
      authorHandle = comment.authorHandle;
      authorAvatar = comment.authorAvatar;
      text = comment.text;
      likeCount = comment.likeCount;
      createdAt = comment.createdAt;
      isLiked = false;
    };
  };

  public shared ({ caller }) func deleteComment(videoId : Common.VideoId, commentId : Common.CommentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    SocialLib.deleteComment(commentStore, caller, videoId, commentId);
    VideoLib.decrementCommentCount(videoStore, videoId);
  };

  public shared ({ caller }) func likeComment(videoId : Common.VideoId, commentId : Common.CommentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    SocialLib.likeComment(commentStore, commentLikesStore, videoId, commentId, caller);
  };

  public shared ({ caller }) func unlikeComment(videoId : Common.VideoId, commentId : Common.CommentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    SocialLib.unlikeComment(commentStore, commentLikesStore, videoId, commentId, caller);
  };

  public shared ({ caller }) func sendGift(videoId : Common.VideoId, giftType : SocialTypes.GiftType) : async SocialTypes.Gift {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let video = switch (VideoLib.getVideo(videoStore, videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    let coinValue = SocialLib.getGiftCoinValue(giftType);
    // deduct from sender
    CoinLib.deductCoins(coinBalanceStore, coinTxStore, caller, coinValue, videoId, nextSocialCoinTxId);
    nextSocialCoinTxId += 1;
    // add to receiver
    CoinLib.addCoins(coinBalanceStore, coinTxStore, video.uploaderId, coinValue, videoId, nextSocialCoinTxId);
    nextSocialCoinTxId += 1;
    let gift = SocialLib.sendGift(giftStore, caller, video.uploaderId, videoId, giftType, nextGiftId);
    nextGiftId += 1;
    VideoLib.incrementGiftCount(videoStore, videoId);
    gift;
  };
};
