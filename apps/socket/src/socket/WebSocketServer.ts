import Redis from "ioredis";
import { WebSocket, WebSocketServer } from "ws";
import { env } from "../configs/env.config";
import { v4 as uuid } from 'uuid';
import { TradeEvent } from "@exness/types";

interface CustomWS extends WebSocket {
    id: string;
}

export class WebSocketRelayer {
    private wss: WebSocketServer | null;
    private subscriber: Redis | null = null;
    private sockets: Map<string, CustomWS> = new Map();
    private readonly CHANNEL: string = "binance:trade:data";

    constructor() {
        this.wss = new WebSocketServer({ port: JSON.parse(env.SOCKET_PORT) });

        this.subscriber = new Redis(env.SOCKET_REDIS_URL);
        this.subscriber.subscribe(this.CHANNEL);

        this.init_redis();
        this.init_socket_server();
    }

    private init_redis() {
        this.subscriber?.subscribe(this.CHANNEL);
        this.subscriber?.on('message', (_, message) => {
            const data: TradeEvent = JSON.parse(message);

            this.sockets.forEach((socket) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(data));
                }
            });
        });
    }

    private init_socket_server() {
        this.wss?.on('connection', (ws: CustomWS) => {
            ws.id = uuid();
            this.sockets.set(ws.id, ws);

            ws.on('close', () => {
                this.sockets.delete(ws.id);
            });
        })
    }

}