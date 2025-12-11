export interface TradeEvent {
  symbol: string;
  price: string;
  qty: string;
  trade_time: number;
  event_time: number;
  trade_id: number;
  first_trade_id: number;
  last_trade_id: number;
  is_buyer_maker: boolean;
}

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
