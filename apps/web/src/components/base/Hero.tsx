import TradingCard from "./TradingCard";

export default function Hero() {
  return (
    <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-wider text-emerald-400 mb-8">
            Live Trading Environment
          </div>

          <h1 className="text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1] mb-6">
            Precision infrastructure for serious capital.
          </h1>

          <p className="text-neutral-400 text-lg font-light leading-relaxed mb-10 max-w-md">
            Execute trades with institutional-grade latency and deep liquidity.
          </p>

          <div className="flex gap-4 mb-12">
            <button className="h-12 px-8 rounded-[4px] bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all">
              Get Started
            </button>
            <button className="h-12 px-8 rounded-[4px] border border-white/10 text-neutral-300 text-sm font-medium hover:bg-white/5 transition-all">
              Dont click
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
            <StatItem value="12ms" label="Avg. Latency" />
            <StatItem value="$42B+" label="Daily Volume" />
            <StatItem value="99.99%" label="Uptime" />
          </div>
        </div>

        <TradingCard />
      </div>
    </section>
  );
}

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <div className="text-2xl text-white font-medium tracking-tight">
        {value}
      </div>
      <div className="text-xs text-neutral-500 mt-1">
        {label}
      </div>
    </div>
  );
}
