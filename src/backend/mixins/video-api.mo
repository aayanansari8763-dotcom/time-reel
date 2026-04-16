import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import VideoTypes "../types/video";
import VideoLib "../lib/video";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  videoStore : VideoLib.VideoStore,
  likeStore : VideoLib.LikeStore,
  profileStore : UserLib.ProfileStore,
) {
  var nextVideoId : Nat = 0;

  public query func getVideos(category : ?Text, cursor : ?Nat, limit : Nat) : async [VideoTypes.Video] {
    VideoLib.getVideos(videoStore, category, cursor, limit);
  };

  public query func getTrendingVideos(category : ?Text, limit : Nat) : async [VideoTypes.Video] {
    VideoLib.getTrendingVideos(videoStore, category, limit);
  };

  public query func getVideo(videoId : Common.VideoId) : async ?VideoTypes.Video {
    VideoLib.getVideo(videoStore, videoId);
  };

  public shared ({ caller }) func createVideo(args : VideoTypes.CreateVideoArgs) : async VideoTypes.Video {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let profile = UserLib.getOrInitProfile(profileStore, caller);
    let video = VideoLib.createVideo(videoStore, caller, profile.handle, args, nextVideoId);
    nextVideoId += 1;
    UserLib.incrementVideoCount(profileStore, caller);
    video;
  };

  public shared ({ caller }) func editVideo(
    videoId : Common.VideoId,
    title : Text,
    description : Text,
    tags : [Text],
    category : Text,
  ) : async VideoTypes.Video {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    VideoLib.editVideo(videoStore, caller, videoId, title, description, tags, category);
  };

  public shared ({ caller }) func deleteVideo(videoId : Common.VideoId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    VideoLib.deleteVideo(videoStore, caller, videoId);
    UserLib.decrementVideoCount(profileStore, caller);
  };

  public shared ({ caller }) func likeVideo(videoId : Common.VideoId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let video = switch (VideoLib.getVideo(videoStore, videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    VideoLib.likeVideo(videoStore, likeStore, caller, videoId);
    UserLib.addLikeToCreator(profileStore, video.uploaderId);
  };

  public shared ({ caller }) func unlikeVideo(videoId : Common.VideoId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let video = switch (VideoLib.getVideo(videoStore, videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    VideoLib.unlikeVideo(videoStore, likeStore, caller, videoId);
    UserLib.removeLikeFromCreator(profileStore, video.uploaderId);
  };

  public shared func incrementShare(videoId : Common.VideoId) : async () {
    VideoLib.incrementShare(videoStore, videoId);
  };

  public shared func incrementView(videoId : Common.VideoId) : async () {
    VideoLib.incrementView(videoStore, videoId);
  };
};
