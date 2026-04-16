import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Video = {
    id : Common.VideoId;
    uploaderId : Common.UserId;
    uploaderHandle : Text;
    title : Text;
    description : Text;
    tags : [Text];
    category : Text;
    videoBlob : Storage.ExternalBlob;
    thumbnailBlob : Storage.ExternalBlob;
    likeCount : Nat;
    commentCount : Nat;
    shareCount : Nat;
    giftCount : Nat;
    viewCount : Nat;
    trendingScore : Float;
    createdAt : Common.Timestamp;
    expiresAt : ?Common.Timestamp;
  };

  public type CreateVideoArgs = {
    title : Text;
    description : Text;
    tags : [Text];
    category : Text;
    videoBlob : Storage.ExternalBlob;
    thumbnailBlob : Storage.ExternalBlob;
  };
};
