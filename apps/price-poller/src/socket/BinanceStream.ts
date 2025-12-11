import Redis from "ioredis";
import { env } from "../configs/env.config";
import { TradeEvent, QueueData } from "../types/trade.types";
import DatabaseQueue from "../queue/database_queue";

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
        const key = this.get_redis_publisher_key();
        await this.publisher.publish(key, JSON.stringify(event));
    }

    private get_redis_publisher_key() {
        return "binance:trade:data";
    }
}
