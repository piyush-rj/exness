export default function TradingCard() {
  return (
    <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500/40" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
          <span className="w-2 h-2 rounded-full bg-green-500/40" />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-neutral-300">
          <span className="text-neutral-400">Latency</span>
          <span className="text-emerald-400 font-mono">14ms</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      <div className="relative px-6 pt-6 pb-10 border-b border-white/5">
        <div className="text-white text-3xl font-medium tracking-tight">
          1.0842<span className="text-emerald-400 text-xl align-top ml-0.5">5</span>
        </div>
        <div className="mt-1 text-sm text-emerald-400">↗ +0.04%</div>

        <svg
          className="absolute left-0 bottom-0 w-full h-28"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 C 10 28, 20 32, 30 30 S 50 22, 60 24 S 80 14, 100 12 V 40 H 0 Z"
            fill="rgba(16,185,129,0.15)"
          />
          <path
            d="M0 30 C 10 28, 20 32, 30 30 S 50 22, 60 24 S 80 14, 100 12"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.6"
          />
        </svg>
      </div>

      <div className="px-6 py-4 text-xs text-neutral-500 grid grid-cols-3 gap-4">
        <span>Amount (M)</span>
        <span>Bid</span>
        <span>Ask</span>
      </div>

      <div className="px-6 space-y-2 text-sm font-mono">
        <Row amount="1.5" bid="1.08422" ask="1.08424" />
        <Row amount="5.0" bid="1.08420" ask="1.08426" highlight />
        <Row amount="2.2" bid="1.08418" ask="1.08428" />
      </div>

      <div className="px-6 py-4 grid grid-cols-2 gap-3">
        <button className="rounded-md border border-red-500/30 bg-red-500/10 text-red-400 py-2 text-xs font-medium hover:bg-red-500/20 transition">
          Sell 1.08420
        </button>
        <button className="rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 py-2 text-xs font-medium hover:bg-emerald-500/20 transition">
          Buy 1.08426
        </button>
      </div>
    </div>
  );
}

function Row({
  amount,
  bid,
  ask,
  highlight = false,
}: {
  amount: string;
  bid: string;
  ask: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        'grid grid-cols-3 items-center px-2 py-1 rounded transition',
        highlight ? 'bg-white/5' : 'hover:bg-white/5',
      ].join(' ')}
    >
      <span className="text-neutral-400">{amount}</span>
      <span className="text-emerald-400">{bid}</span>
      <span className="text-red-400">{ask}</span>
    </div>
  );
}
