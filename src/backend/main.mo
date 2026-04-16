import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "types/common";
import VideoTypes "types/video";
import UserTypes "types/user";
import SocialTypes "types/social";
import CoinTypes "types/coins";
import VideoLib "lib/video";
import UserLib "lib/user";
import SocialLib "lib/social";
import CoinLib "lib/coins";
import Migration "lib/migration";
import VideoApi "mixins/video-api";
import UserApi "mixins/user-api";
import SocialApi "mixins/social-api";
import CoinsApi "mixins/coins-api";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage
  include MixinObjectStorage();

  // Stripe configuration (required by lintoko rules — must be in main.mo actor)
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  public shared func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Video state
  let videoStore : VideoLib.VideoStore = Map.empty<Common.VideoId, VideoTypes.Video>();
  let likeStore : VideoLib.LikeStore = Map.empty<Common.VideoId, Set.Set<Common.UserId>>();

  // User state
  let profileStore : UserLib.ProfileStore = Map.empty<Common.UserId, UserTypes.UserProfile>();
  let followStore : UserLib.FollowStore = Map.empty<Common.UserId, Set.Set<Common.UserId>>();

  // Social state
  // commentStore is kept with the V1 type for stable migration purposes.
  // Real app logic uses commentStoreV2 (new Comment shape with authorAvatar + likeCount).
  let commentStore : Migration.V1CommentStore = Map.empty<Common.VideoId, List.List<Migration.V1Comment>>();
  let commentStoreV2 : SocialLib.CommentStore = Map.empty<Common.VideoId, List.List<SocialTypes.Comment>>();
  let commentLikesStore : SocialLib.CommentLikesStore = Map.empty<Common.CommentId, Set.Set<Common.UserId>>();
  let giftStore : SocialLib.GiftStore = Map.empty<Common.GiftId, SocialTypes.Gift>();

  // Coin state
  let coinBalanceStore : CoinLib.BalanceStore = Map.empty<Common.UserId, Nat>();
  let coinTxStore : CoinLib.TransactionStore = Map.empty<Common.UserId, List.List<CoinTypes.CoinTransaction>>();

  // On upgrade: migrate any V1 comments (no authorAvatar/likeCount) to V2 shape.
  system func postupgrade() {
    if (not commentStore.isEmpty()) {
      Migration.migrateV1Comments(commentStore, commentStoreV2);
      commentStore.clear();
    };
  };

  // Mixins
  include VideoApi(accessControlState, videoStore, likeStore, profileStore);
  include UserApi(accessControlState, profileStore, followStore);
  include SocialApi(accessControlState, commentStoreV2, commentLikesStore, giftStore, profileStore, videoStore, coinBalanceStore, coinTxStore);
  include CoinsApi(accessControlState, coinBalanceStore, coinTxStore, giftStore);
};
