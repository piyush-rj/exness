import { WebSocket } from "ws";
import { env } from "../configs/env.config";

export default class WebSocketClient {
    private ws: WebSocket | null = null;

    constructor() {
        this.ws = new WebSocket(env.NEXT_PUBLIC_SOCKET_URL);
    }
}