import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import SocialTypes "../types/social";
import SocialLib "../lib/social";

/// Migration helpers for schema evolution.
/// V1Comment is the old shape (no authorAvatar, no likeCount).
module {
  public type V1Comment = {
    id : Common.CommentId;
    videoId : Common.VideoId;
    authorPrincipal : Common.UserId;
    authorHandle : Text;
    text : Text;
    createdAt : Common.Timestamp;
  };

  public type V1CommentStore = Map.Map<Common.VideoId, List.List<V1Comment>>;

  /// Migrate a V1CommentStore to the current CommentStore by back-filling
  /// authorAvatar = "" and likeCount = 0 for every existing comment.
  public func migrateV1Comments(
    old : V1CommentStore,
    target : SocialLib.CommentStore,
  ) : () {
    for ((videoId, v1List) in old.entries()) {
      let v1Array = v1List.toArray();
      let newList = List.empty<SocialTypes.Comment>();
      for (v1 in v1Array.vals()) {
        let c : SocialTypes.Comment = {
          id = v1.id;
          videoId = v1.videoId;
          authorPrincipal = v1.authorPrincipal;
          authorHandle = v1.authorHandle;
          authorAvatar = "";
          text = v1.text;
          likeCount = 0;
          createdAt = v1.createdAt;
        };
        newList.add(c);
      };
      target.add(videoId, newList);
    };
  };
};
