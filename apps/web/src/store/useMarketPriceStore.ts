import { create } from 'zustand';

interface MarketPriceStoreData {
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;


}

export const useMarketPriceStore = create<MarketPriceStoreData>((set) => ({
    isConnected: false,
    setIsConnected: (value: boolean) => set({ isConnected: value })
}))