import Redis from "ioredis";
import { env } from "../configs/env.config";

export class RedisSubscriber {
    private subscriber: Redis;
    public prices_map: Map<string, any>;

    constructor() {
        this.subscriber = new Redis(env.SERVER_REDIS_URL);
        this.prices_map = new Map();
    }

    private get_live_proces(){
        this.subscriber.subscribe('binance:trade:data');
        this.subscriber.on('message', () => {
            this.prices_map.set
        })
    }
}