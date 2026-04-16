import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Common "../types/common";
import UserTypes "../types/user";

module {
  public type ProfileStore = Map.Map<Common.UserId, UserTypes.UserProfile>;
  public type FollowStore = Map.Map<Common.UserId, Set.Set<Common.UserId>>;

  // Build a short readable handle from principal text (first 8 chars after "user_")
  func makeHandle(p : Principal) : Text {
    let t = p.toText();
    let truncated = if (t.size() <= 8) { t } else {
      Text.fromIter(t.toIter().take(8))
    };
    "user_" # truncated
  };

  public func getOrInitProfile(
    store : ProfileStore,
    caller : Common.UserId,
  ) : UserTypes.UserProfile {
    switch (store.get(caller)) {
      case (?p) { p };
      case (null) {
        let profile : UserTypes.UserProfile = {
          principal = caller;
          handle = makeHandle(caller);
          displayName = "New User";
          avatarBlob = null;
          bio = "";
          followerCount = 0;
          followingCount = 0;
          totalLikes = 0;
          totalVideos = 0;
          coinBalance = 0;
          totalCoinsEarned = 0;
          joinedAt = Time.now();
        };
        store.add(caller, profile);
        profile;
      };
    };
  };

  public func getProfile(
    store : ProfileStore,
    userId : Common.UserId,
  ) : ?UserTypes.UserProfile {
    store.get(userId);
  };

  public func getMyProfile(
    store : ProfileStore,
    caller : Common.UserId,
  ) : UserTypes.UserProfile {
    getOrInitProfile(store, caller);
  };

  public func saveCallerUserProfile(
    store : ProfileStore,
    caller : Common.UserId,
    args : UserTypes.SaveProfileArgs,
  ) : UserTypes.UserProfile {
    let existing = getOrInitProfile(store, caller);
    let updated : UserTypes.UserProfile = {
      existing with
      handle = args.handle;
      displayName = args.displayName;
      avatarBlob = args.avatarBlob;
      bio = args.bio;
    };
    store.add(caller, updated);
    updated;
  };

  public func getCallerUserProfile(
    store : ProfileStore,
    caller : Common.UserId,
  ) : ?UserTypes.UserProfile {
    store.get(caller);
  };

  public func followUser(
    store : ProfileStore,
    followStore : FollowStore,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };
    let following = switch (followStore.get(caller)) {
      case (null) {
        let s = Set.empty<Common.UserId>();
        followStore.add(caller, s);
        s;
      };
      case (?s) { s };
    };
    if (following.contains(target)) {
      Runtime.trap("Already following");
    };
    following.add(target);

    // update caller followingCount
    let callerProfile = getOrInitProfile(store, caller);
    store.add(caller, { callerProfile with followingCount = callerProfile.followingCount + 1 });

    // update target followerCount
    let targetProfile = getOrInitProfile(store, target);
    store.add(target, { targetProfile with followerCount = targetProfile.followerCount + 1 });
  };

  public func unfollowUser(
    store : ProfileStore,
    followStore : FollowStore,
    caller : Common.UserId,
    target : Common.UserId,
  ) : () {
    let following = switch (followStore.get(caller)) {
      case (null) { Runtime.trap("Not following") };
      case (?s) { s };
    };
    if (not following.contains(target)) {
      Runtime.trap("Not following");
    };
    following.remove(target);

    // update caller followingCount
    let callerProfile = getOrInitProfile(store, caller);
    let newFollowing = if (callerProfile.followingCount > 0) { callerProfile.followingCount - 1 } else { 0 };
    store.add(caller, { callerProfile with followingCount = newFollowing });

    // update target followerCount
    let targetProfile = getOrInitProfile(store, target);
    let newFollowers = if (targetProfile.followerCount > 0) { targetProfile.followerCount - 1 } else { 0 };
    store.add(target, { targetProfile with followerCount = newFollowers });
  };

  public func incrementVideoCount(
    store : ProfileStore,
    userId : Common.UserId,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        store.add(userId, { p with totalVideos = p.totalVideos + 1 });
      };
    };
  };

  public func decrementVideoCount(
    store : ProfileStore,
    userId : Common.UserId,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        let newCount = if (p.totalVideos > 0) { p.totalVideos - 1 } else { 0 };
        store.add(userId, { p with totalVideos = newCount });
      };
    };
  };

  public func addLikeToCreator(
    store : ProfileStore,
    userId : Common.UserId,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        store.add(userId, { p with totalLikes = p.totalLikes + 1 });
      };
    };
  };

  public func removeLikeFromCreator(
    store : ProfileStore,
    userId : Common.UserId,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        let newCount = if (p.totalLikes > 0) { p.totalLikes - 1 } else { 0 };
        store.add(userId, { p with totalLikes = newCount });
      };
    };
  };

  public func addCoinsToBalance(
    store : ProfileStore,
    userId : Common.UserId,
    amount : Nat,
    isEarned : Bool,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        let newBalance = p.coinBalance + amount;
        let newEarned = if (isEarned) { p.totalCoinsEarned + amount } else { p.totalCoinsEarned };
        store.add(userId, { p with coinBalance = newBalance; totalCoinsEarned = newEarned });
      };
    };
  };

  public func deductCoinsFromBalance(
    store : ProfileStore,
    userId : Common.UserId,
    amount : Nat,
  ) : () {
    switch (store.get(userId)) {
      case (null) {};
      case (?p) {
        if (p.coinBalance < amount) {
          Runtime.trap("Insufficient coin balance");
        };
        store.add(userId, { p with coinBalance = p.coinBalance - amount });
      };
    };
  };
};
