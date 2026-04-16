import Common "common";

module {
  public type Comment = {
    id : Common.CommentId;
    videoId : Common.VideoId;
    authorPrincipal : Common.UserId;
    authorHandle : Text;
    authorAvatar : Text;
    text : Text;
    likeCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Returned by getComments — includes per-caller context (isLiked)
  public type CommentWithContext = {
    id : Common.CommentId;
    videoId : Common.VideoId;
    authorHandle : Text;
    authorAvatar : Text;
    text : Text;
    likeCount : Nat;
    createdAt : Common.Timestamp;
    isLiked : Bool;
  };

  public type GiftType = {
    #rose;
    #heart;
    #crown;
    #diamond;
    #rocket;
  };

  public type Gift = {
    id : Common.GiftId;
    videoId : Common.VideoId;
    senderPrincipal : Common.UserId;
    receiverPrincipal : Common.UserId;
    giftEmoji : Text;
    coinValue : Nat;
    createdAt : Common.Timestamp;
  };
};
