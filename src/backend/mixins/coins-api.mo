import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import CoinTypes "../types/coins";
import SocialTypes "../types/social";
import CoinLib "../lib/coins";

mixin (
  accessControlState : AccessControl.AccessControlState,
  coinBalanceStore : CoinLib.BalanceStore,
  coinTxStore : CoinLib.TransactionStore,
  giftStore : Map.Map<Common.GiftId, SocialTypes.Gift>,
) {
  var nextCoinTxId : Nat = 0;

  public query ({ caller }) func getCoinBalance() : async Nat {
    CoinLib.getCoinBalance(coinBalanceStore, caller);
  };

  public query ({ caller }) func getCoinTransactions() : async [CoinTypes.CoinTransaction] {
    CoinLib.getCoinTransactions(coinTxStore, caller);
  };

  public query func getCoinPacks() : async [CoinTypes.CoinPack] {
    CoinLib.getCoinPacks();
  };

  public shared ({ caller }) func purchaseCoins(packId : Text, sessionId : Text) : async CoinTypes.CoinTransaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    // sessionId is validated by frontend via getStripeSessionStatus before calling this
    let tx = CoinLib.purchaseCoins(coinBalanceStore, coinTxStore, caller, packId, sessionId, nextCoinTxId);
    nextCoinTxId += 1;
    tx;
  };

  public query ({ caller }) func getCreatorEarnings() : async { totalCoins : Nat; recentGifts : [SocialTypes.Gift] } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    CoinLib.getCreatorEarnings(coinBalanceStore, giftStore, caller);
  };
};
