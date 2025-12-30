import { UpdatedTradeData } from "@exness/types";

export type WSHandler = (trade: UpdatedTradeData) => void;

export default class WebSocketClient {
    private ws: WebSocket | null = null;
    private connected: boolean = false;
    private handlers: Set<WSHandler> = new Set();
    private is_manually_closed: boolean = false;
    private reconnect_attempts: number = 0;
    private max_reconnect_attempts: number = 5;
    private reconnect_delay: number = 1000;
    private max_reconnect_delay: number = 30000;
    private persistent_reconnect_delay: number = 5000;
    private reconnect_timeout: ReturnType<typeof setTimeout> | null = null;
    private url: string = process.env.NEXT_PUBLIC_SOCKET_URL!;

    constructor() {
        this.init_connection();
    }

    private init_connection() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            this.connected = true;
            this.reconnect_attempts = 0;
            this.reconnect_delay = 1000;
        };

        this.ws.onmessage = (event: MessageEvent<string>) => {
            try {
                const parsed: UpdatedTradeData = JSON.parse(event.data);
                this.handle_incoming_message(parsed);
            } catch (error) {   
                console.error('Failed to parse data');
            }
        }

        this.ws.onclose = () => {
            this.connected = false;
            if (this.reconnect_timeout) {
                clearTimeout(this.reconnect_timeout);
                this.reconnect_timeout = null;
            }

            if (this.is_manually_closed) return;
            this.attempt_reconnect();
        }

        this.ws.onerror = (error) => {
            console.log('ws client error: ', error);
        }
    }

    private handle_incoming_message(parsed: UpdatedTradeData) {
        this.handlers.forEach((handler) => {
            try {
                handler(parsed);
            } catch (error) {
                console.error('ws handler error');
            }
        });
    }

    public subscribe(handler: WSHandler) {
        this.handlers.add(handler);
    }

    public unsubscribe(handler: WSHandler) {
        this.handlers.delete(handler);
    }

    private attempt_reconnect(): void {
        if (this.reconnect_timeout) return;

        this.reconnect_attempts++;
        
        let delay: number;

        if (this.reconnect_attempts <= this.max_reconnect_attempts) {
            delay = this.reconnect_delay;
            this.reconnect_delay = Math.min(this.reconnect_delay * 2, this.max_reconnect_delay);
        } else {
            console.info('max reconnect attempt reached');
            delay = this.persistent_reconnect_delay;
            this.reconnect_delay = 1000;
        }

        this.reconnect_timeout = setTimeout(() => {
            if (!this.is_manually_closed) {
                this.init_connection();
            }
        }, delay);
    }

    public close(code: number = 1000, reason: string = 'client disconnected'): void {
        this.is_manually_closed = true;

        if (this.reconnect_timeout) {
            clearTimeout(this.reconnect_timeout);
            this.reconnect_timeout = null;
        }

        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            this.ws.close(code, reason);
        }

        this.connected = false;
        this.handlers.clear();
    }

    public is_connected(): boolean {
        return this.connected;
    }

}