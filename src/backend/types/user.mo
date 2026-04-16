import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserProfile = {
    principal : Common.UserId;
    handle : Text;
    displayName : Text;
    avatarBlob : ?Storage.ExternalBlob;
    bio : Text;
    followerCount : Nat;
    followingCount : Nat;
    totalLikes : Nat;
    totalVideos : Nat;
    coinBalance : Nat;
    totalCoinsEarned : Nat;
    joinedAt : Common.Timestamp;
  };

  public type SaveProfileArgs = {
    handle : Text;
    displayName : Text;
    avatarBlob : ?Storage.ExternalBlob;
    bio : Text;
  };
};
