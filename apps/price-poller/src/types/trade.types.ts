import { TradeEvent } from "@exness/types";

export interface QueueData {
  symbol: string;
  price: string;
  quantity: string;
  timestamp: Date;
}

export interface TradeData {
  symbol: string;
  price: string;
  quantity: string;
  tradeTime: Date;
}

