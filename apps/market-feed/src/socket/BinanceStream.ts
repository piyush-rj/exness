import Redis from 'ioredis';
import dotenv from 'dotenv';
import TradeProcessor from '../queue/DatabaseQueue';
import DatabaseQueue from '../queue/DatabaseQueue';

export interface MarketTrade {
    symbol: string;
    price: string;
    quantity: string;
    trade_id: number;
    trade_timestamp: number; // time when trade actually happened
    event_timestamp: number; // event trigger time (Binance internal)
    buyer_order_id?: number;
    seller_order_id?: number;
    is_buyer_maker: boolean;
    first_trade_id: number;
    last_trade_id: number;
}

export interface EnrichedTrade extends MarketTrade {
    ask_price: string;
    bid_price: string;
    spread_percent: number;
}

interface SpreadCalculation {
    ask: string;
    bid: string;
}

dotenv.config();
const REDIS_URL = process.env.REDIS_URL;
const BINANCE_STREAM_URL = `wss://stream.binance.com:9443/stream?streams=${[
    'btcusdt@aggTrade',
    'ethusdt@aggTrade',
].join('/')}`;



// connect to binance stream
// publish the event to redis
// calculate spread and enhanced data => ask, bid, spread
export default class BinanceStream {
    private socket: WebSocket | null = null;
    private redis_pub: Redis | null = null;
    private trade_processor: DatabaseQueue;
    private spread_percent: number = 1;

    constructor() {
        this.connect_binance();
        this.redis_pub = new Redis(REDIS_URL!);
        this.trade_processor = new DatabaseQueue();
    }

    private connect_binance(): void {
        this.socket = new WebSocket(BINANCE_STREAM_URL);

        this.socket.onopen = (): void => {
            console.log('connected to binance stream');
        };

        this.socket.onmessage = ({ data }: MessageEvent<string>): void => {
            const message = JSON.parse(data.toString());
            const trade_data: MarketTrade = {
                symbol: message.data.s,
                price: message.data.p,
                quantity: message.data.q,
                trade_id: message.data.a,
                trade_timestamp: message.data.T,
                event_timestamp: message.data.E,
                is_buyer_maker: message.data.m,
                first_trade_id: message.data.f,
                last_trade_id: message.data.l,
            };

            console.log(trade_data);

            this.send_to_redis(trade_data);
            this.trade_processor.add_trade(trade_data);
        };
    }

    private async send_to_redis(trade_data: MarketTrade): Promise<void> {
        const channel = this.get_channel_name();
        const spread_result = this.calculate_spread(trade_data.price);
        const enriched: EnrichedTrade = {
            ...trade_data,
            ask_price: spread_result.ask,
            bid_price: spread_result.bid,
            spread_percent: this.spread_percent,
        };

        await this.redis_pub?.publish(channel, JSON.stringify(enriched));
    }

    private calculate_spread(price: string): SpreadCalculation {
        const current_price = parseFloat(price);
        const spread_factor = this.spread_percent / 100;

        const ask_level = current_price * (1 + spread_factor);
        const bid_level = current_price * (1 - spread_factor);
        const decimals = (price.split('.')[1] || '').length;

        return {
            ask: ask_level.toFixed(decimals),
            bid: bid_level.toFixed(decimals),
        };
    }

    private get_channel_name(): string {
        return 'market:binance:trades';
    }
}