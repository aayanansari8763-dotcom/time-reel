import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Common "../types/common";
import CoinTypes "../types/coins";
import SocialTypes "../types/social";

module {
  public type TransactionStore = Map.Map<Common.UserId, List.List<CoinTypes.CoinTransaction>>;
  public type BalanceStore = Map.Map<Common.UserId, Nat>;

  let COIN_PACKS : [CoinTypes.CoinPack] = [
    { id = "basic"; coins = 10; priceInCents = 99; displayName = "Basic Pack — 10 Coins" },
    { id = "standard"; coins = 50; priceInCents = 399; displayName = "Standard Pack — 50 Coins" },
    { id = "premium"; coins = 100; priceInCents = 799; displayName = "Premium Pack — 100 Coins" },
    { id = "pro"; coins = 500; priceInCents = 1499; displayName = "Pro Pack — 500 Coins" },
  ];

  func getPackById(packId : Text) : CoinTypes.CoinPack {
    let found = COIN_PACKS.find(func(p) = p.id == packId);
    switch (found) {
      case (null) { Runtime.trap("Unknown coin pack: " # packId) };
      case (?p) { p };
    };
  };

  func recordTransaction(
    txStore : TransactionStore,
    userId : Common.UserId,
    amount : Nat,
    txType : CoinTypes.TransactionType,
    referenceId : Text,
    nextId : Nat,
  ) : CoinTypes.CoinTransaction {
    let tx : CoinTypes.CoinTransaction = {
      id = nextId.toText();
      userPrincipal = userId;
      amount;
      transactionType = txType;
      referenceId;
      createdAt = Time.now();
    };
    let list = switch (txStore.get(userId)) {
      case (null) {
        let l = List.empty<CoinTypes.CoinTransaction>();
        txStore.add(userId, l);
        l;
      };
      case (?l) { l };
    };
    list.add(tx);
    tx;
  };

  public func getCoinBalance(
    balanceStore : BalanceStore,
    caller : Common.UserId,
  ) : Nat {
    switch (balanceStore.get(caller)) {
      case (null) { 0 };
      case (?b) { b };
    };
  };

  public func getCoinTransactions(
    txStore : TransactionStore,
    caller : Common.UserId,
  ) : [CoinTypes.CoinTransaction] {
    switch (txStore.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public func purchaseCoins(
    balanceStore : BalanceStore,
    txStore : TransactionStore,
    caller : Common.UserId,
    packId : Text,
    stripeSessionId : Text,
    nextId : Nat,
  ) : CoinTypes.CoinTransaction {
    let pack = getPackById(packId);
    let current = switch (balanceStore.get(caller)) {
      case (null) { 0 };
      case (?b) { b };
    };
    balanceStore.add(caller, current + pack.coins);
    recordTransaction(txStore, caller, pack.coins, #purchase, stripeSessionId, nextId);
  };

  public func deductCoins(
    balanceStore : BalanceStore,
    txStore : TransactionStore,
    caller : Common.UserId,
    amount : Nat,
    referenceId : Text,
    nextId : Nat,
  ) : () {
    let current = switch (balanceStore.get(caller)) {
      case (null) { 0 };
      case (?b) { b };
    };
    if (current < amount) {
      Runtime.trap("Insufficient coin balance");
    };
    balanceStore.add(caller, current - amount);
    ignore recordTransaction(txStore, caller, amount, #gift_sent, referenceId, nextId);
  };

  public func addCoins(
    balanceStore : BalanceStore,
    txStore : TransactionStore,
    userId : Common.UserId,
    amount : Nat,
    referenceId : Text,
    nextId : Nat,
  ) : () {
    let current = switch (balanceStore.get(userId)) {
      case (null) { 0 };
      case (?b) { b };
    };
    balanceStore.add(userId, current + amount);
    ignore recordTransaction(txStore, userId, amount, #gift_received, referenceId, nextId);
  };

  public func getCreatorEarnings(
    balanceStore : BalanceStore,
    giftStore : Map.Map<Common.GiftId, SocialTypes.Gift>,
    caller : Common.UserId,
  ) : { totalCoins : Nat; recentGifts : [SocialTypes.Gift] } {
    let totalCoins = switch (balanceStore.get(caller)) {
      case (null) { 0 };
      case (?b) { b };
    };
    let recentGifts = giftStore.entries()
      .filter(func((_, g)) { g.receiverPrincipal == caller })
      .map(func((_, g)) { g })
      .toArray();
    { totalCoins; recentGifts };
  };

  public func getCoinPacks() : [CoinTypes.CoinPack] {
    COIN_PACKS;
  };
};
