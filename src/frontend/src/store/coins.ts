import { create } from "zustand";
import type { CoinTransaction } from "../types";

interface CoinsState {
  balance: number;
  transactions: CoinTransaction[];
  setBalance: (balance: number) => void;
  addTransaction: (tx: CoinTransaction) => void;
  deductCoins: (amount: number) => void;
  addCoins: (amount: number) => void;
}

export const useCoinsStore = create<CoinsState>((set) => ({
  balance: 0,
  transactions: [],
  setBalance: (balance) => set({ balance }),
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),
  deductCoins: (amount) =>
    set((state) => ({ balance: Math.max(0, state.balance - amount) })),
  addCoins: (amount) => set((state) => ({ balance: state.balance + amount })),
}));
