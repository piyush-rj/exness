'use client'
import useWebSocket from "@/src/hooks/useWebSocket";

export default function CandleViewer() {
    const { isConnected, marketData } = useWebSocket();

    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h2>Live Market Dashboard</h2>

            <div style={{ marginBottom: "12px" }}>
                Status:{" "}
                <span style={{ color: isConnected ? "green" : "red" }}>
                    {isConnected ? "CONNECTED" : "DISCONNECTED"}
                </span>
            </div>

            <div>
                {Object.keys(marketData).length === 0 ? (
                    <div>No data yet…</div>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr>
                                <th align="left">Symbol</th>
                                <th align="right">Price</th>
                                <th align="right">Bid</th>
                                <th align="right">Ask</th>
                                <th align="right">Qty</th>
                                <th align="right">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(marketData).map((trade) => (
                                <tr key={trade.symbol}>
                                    <td>{trade.symbol}</td>
                                    <td align="right">{trade.price}</td>
                                    <td align="right">{trade.bid}</td>
                                    <td align="right">{trade.ask}</td>
                                    <td align="right">{trade.qty}</td>
                                    <td align="right">
                                        {new Date(trade.trade_time).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}