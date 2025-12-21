import Redis from "ioredis";
import { env } from "../configs/env.config";
import { QueueData } from "../types/trade.types";
import DatabaseQueue from "../queue/DatabaseQueue";
import { TradeEvent, UpdatedTradeData } from "@exness/types";

const url =
    `${env.MARKET_FEED_WS_URL}/stream?streams=` +
    [
        "btcusdt@aggTrade",
        "ethusdt@aggTrade",
        "bnbusdt@aggTrade",
        "xrpusdt@aggTrade",
        "adausdt@aggTrade",
    ].join("/");

export default class BinanceStream {
    private ws: WebSocket | null = null;
    private publisher: Redis;
    private db_queue: DatabaseQueue;
    private readonly CHANNEL: string = "binance:trade:data";

    constructor() {
        this.publisher = new Redis(env.REDIS_URL);
        this.db_queue = new DatabaseQueue("trades");
        this.init_connection();
    }

    private init_connection() {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log("connected");
        };

        this.ws.onmessage = ({ data }) => {
            try {
                const parsed = JSON.parse(data);
                const payload = parsed.data ?? parsed;

                const event: TradeEvent = {
                    symbol: payload.s,
                    price: payload.p,
                    qty: payload.q,
                    trade_time: payload.T,
                    event_time: payload.E,
                    trade_id: payload.a,
                    first_trade_id: payload.f,
                    last_trade_id: payload.l,
                    is_buyer_maker: payload.m,
                };

                console.log('event received: ', event);
                this.publish_event_to_redis(event);
                this.process_db(event);
            } catch (err) {
                console.error('failed to process binance data: ', err)
            }
        };
    }

    private process_db(event: TradeEvent) {
        try {
            const job: QueueData = {
                symbol: event.symbol,
                price: event.price,
                quantity: event.qty,
                timestamp: new Date(event.trade_time),
            }

            this.db_queue.enqueue_job(job);
        } catch (error) {
            console.error('failed to queue data to db', error);
        }
    }

    private async publish_event_to_redis(event: TradeEvent) {
        const spread_data = this.get_spread(event.price);

        const updated_data: UpdatedTradeData = {
            ...event,
            ask: spread_data.ask,
            bid: spread_data.bid,
        }

        await this.publisher.publish(this.CHANNEL, JSON.stringify(updated_data));
    }

    private get_spread(price: string) {
        const numeric_price = parseFloat(price);
        const spread = 1 / 100;

        const bid_price = numeric_price * (1 - spread);
        const ask_price = numeric_price * (1 + spread);
        const decimalPlaces = (price.split('.')[1] || '').length;

        return {
            bid: bid_price.toFixed(decimalPlaces),
            ask: ask_price.toFixed(decimalPlaces)
        };
    }
}
