import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActor } from "../backend";
import { useCoinsStore } from "../store/coins";
import type { CoinPack, CoinTransaction } from "../types";

const SAMPLE_COIN_PACKS: CoinPack[] = [
  { id: "pack_s", name: "Starter", coins: 100, price: 0.99 },
  {
    id: "pack_m",
    name: "Popular",
    coins: 500,
    price: 4.99,
    bonus: 50,
    popular: true,
  },
  { id: "pack_l", name: "Creator", coins: 1000, price: 8.99, bonus: 200 },
  { id: "pack_xl", name: "Influencer", coins: 5000, price: 39.99, bonus: 1500 },
];

export function useCoinBalance() {
  const { actor, isFetching } = useActor(createActor);
  const setBalance = useCoinsStore((s) => s.setBalance);
  const balance = useCoinsStore((s) => s.balance);

  const query = useQuery<number>({
    queryKey: ["coins", "balance"],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        // const result = await actor.getCoinBalance();
        return 0;
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setBalance(query.data);
    }
  }, [query.data, setBalance]);

  return { ...query, balance };
}

export function useCoinTransactions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CoinTransaction[]>({
    queryKey: ["coins", "transactions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCoinPacks() {
  return useQuery<CoinPack[]>({
    queryKey: ["coins", "packs"],
    queryFn: async () => SAMPLE_COIN_PACKS,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function usePurchaseCoins() {
  const queryClient = useQueryClient();
  const addCoins = useCoinsStore((s) => s.addCoins);
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({ packId }: { packId: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const pack = SAMPLE_COIN_PACKS.find((p) => p.id === packId);
      if (!pack) throw new Error("Pack not found");
      // await actor.purchaseCoins(packId);
      return pack;
    },
    onSuccess: (pack) => {
      if (pack) {
        addCoins(pack.coins + (pack.bonus ?? 0));
      }
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });
}
