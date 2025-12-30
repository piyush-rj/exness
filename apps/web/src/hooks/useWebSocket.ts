import { useEffect, useRef, useState } from "react";
import WebSocketClient, { WSHandler } from "../socket/socket.client";
import { useUserSessionStore } from "../store/useUserSessionStore";
import { UpdatedTradeData } from "@exness/types";

type MarketBuffer = Record<string, UpdatedTradeData>;

export default function useWebSocket() {
    const socketRef = useRef<WebSocketClient | null>(null);
    const bufferRef = useRef<Record<string, UpdatedTradeData>>({});
    const flushTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { session } = useUserSessionStore();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [marketData, setMarketData] = useState<MarketBuffer>({});

    useEffect(() => {
        if (!session || !session.user.token) return;
        if (socketRef.current) return;

        const socket = new WebSocketClient();
        socketRef.current = socket;

        socket.subscribe(bufferSetter);
        startFlusher(socket);        

        return () => {
            stopFlusher();
            socket.unsubscribe(bufferSetter);
            socket.close();

            setMarketData({});
            setIsConnected(false);

            socketRef.current = null;
            bufferRef.current = {};
        }
    }, [session?.user.token]);

    function bufferSetter(trade: UpdatedTradeData) {
        bufferRef.current[trade.symbol] = trade;
    }

    function startFlusher(socket: WebSocketClient) {
        flushTimeRef.current = setInterval(() => {
            setMarketData({...bufferRef.current});
            setIsConnected(socket.is_connected());
        }, 200);
    }

    function stopFlusher() {
        if (flushTimeRef.current) {
            clearInterval(flushTimeRef.current);
            flushTimeRef.current = null;
        }
    }

    return {
        isConnected,
        marketData,
    }
}