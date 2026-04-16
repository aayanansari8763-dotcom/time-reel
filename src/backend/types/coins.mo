import Common "common";

module {
  public type TransactionType = {
    #purchase;
    #gift_sent;
    #gift_received;
  };

  public type CoinTransaction = {
    id : Common.TransactionId;
    userPrincipal : Common.UserId;
    amount : Nat;
    transactionType : TransactionType;
    referenceId : Text;
    createdAt : Common.Timestamp;
  };

  public type CoinPack = {
    id : Text;
    coins : Nat;
    priceInCents : Nat;
    displayName : Text;
  };

  public type CreatorEarnings = {
    totalCoins : Nat;
    recentGifts : [Common.GiftId];
  };
};
