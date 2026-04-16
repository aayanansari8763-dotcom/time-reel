import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/user";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profileStore : UserLib.ProfileStore,
  followStore : UserLib.FollowStore,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    UserLib.getCallerUserProfile(profileStore, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(args : UserTypes.SaveProfileArgs) : async UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UserLib.saveCallerUserProfile(profileStore, caller, args);
  };

  public query func getProfile(userId : Common.UserId) : async ?UserTypes.UserProfile {
    UserLib.getProfile(profileStore, userId);
  };

  public query ({ caller }) func getMyProfile() : async UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UserLib.getMyProfile(profileStore, caller);
  };

  public shared ({ caller }) func followUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UserLib.followUser(profileStore, followStore, caller, target);
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UserLib.unfollowUser(profileStore, followStore, caller, target);
  };
};
