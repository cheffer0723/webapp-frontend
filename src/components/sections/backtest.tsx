import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  type TooltipProps,
} from "recharts";
import { DecodeText } from "../ui/decode-text";
import {
  ENGINES,
  MARKETS,
  getBacktest,
  type EngineKey,
  type MarketKey,
} from "@/lib/backtest-data";

const TONE: Record<string, string> = {
  cyan: "text-primary",
  amber: "text-amber-400",
  rose: "text-rose-400",
  default: "text-white",
};

function fmtPct(x: number): string {
  return `${x >= 0 ? "+" : ""}${x.toFixed(1)}%`;
}

function ChartTooltip({
  active,
  payload,
  label,
  compareName,
}: TooltipProps<number, string> & { compareName?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const strat = payload.find((p) => p.dataKey === "strategy")?.value;
  const bh = payload.find((p) => p.dataKey === "buyHold")?.value;
  const cmp = payload.find((p) => p.dataKey === "compare")?.value;
  const delta =
    typeof strat === "number" && typeof bh === "number" && bh > 0
      ? (strat / bh - 1) * 100
      : null;
  return (
    <div className="border border-primary/30 bg-[#000206]/95 px-3 py-2 font-mono text-[11px] shadow-[0_0_30px_rgba(0,200,255,0.1)]">
      <div className="mb-1 text-white/40 tracking-[0.2em] uppercase">{label}</div>
      <div className="flex items-center gap-2 text-primary">
        <span className="inline-block h-[2px] w-3 bg-primary" />
        Strategy {typeof strat === "number" ? strat.toLocaleString() : "-"}
      </div>
      {typeof cmp === "number" && (
        <div className="flex items-center gap-2 text-[rgb(196,150,255)]">
          <span className="inline-block h-[2px] w-3 bg-[rgb(168,85,247)]" />
          {compareName ?? "Compare"} {cmp.toLocaleString()}
        </div>
      )}
      <div className="flex items-center gap-2 text-white/55">
        <span className="inline-block h-[2px] w-3 bg-[#5b6472]" />
        Buy &amp; Hold {typeof bh === "number" ? bh.toLocaleString() : "-"}
      </div>
      {delta !== null && (
        <div className="mt-1 border-t border-white/10 pt-1 text-white/45">
          vs B&amp;H{" "}
          <span className={delta >= 0 ? "text-primary" : "text-rose-400"}>
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function Backtest() {
  const [engine, setEngine] = useState<EngineKey>("orthrus");
  const [market, setMarket] = useState<MarketKey>("SPY");
  const [scale, setScale] = useState<"linear" | "log">("linear");
  const [compare, setCompare] = useState<EngineKey | null>(null);
  const gradId = useId();

  // Comparing an engine against itself is meaningless — drop a stale selection.
  useEffect(() => {
    if (compare === engine) setCompare(null);
  }, [compare, engine]);

  const data = useMemo(() => getBacktest(engine, market), [engine, market]);
  const compareData = useMemo(
    () => (compare && compare !== engine ? getBacktest(compare, market) : null),
    [compare, engine, market],
  );
  // Derive from compareData (not compare) so the legend never shows a stale name
  // for a single frame after switching the primary engine to the compared one.
  const compareName = compareData
    ? ENGINES.find((e) => e.key === compare)?.name
    : undefined;

  // Same market => aligned sampling, so the comparison curve merges in by index.
  const curve = useMemo(() => {
    if (!compareData) return data.curve;
    return data.curve.map((pt, i) => ({
      ...pt,
      compare: compareData.curve[i]?.strategy,
    }));
  }, [data, compareData]);

  // Log scale only valid when every plotted value is strictly positive.
  const canLog = useMemo(
    () =>
      data.curve.every((p) => p.strategy > 0 && p.buyHold > 0) &&
      (compareData ? compareData.curve.every((p) => p.strategy > 0) : true),
    [data, compareData],
  );
  const logActive = scale === "log" && canLog;

  // If a market/compare change ever invalidates log scale, drop the hidden
  // preference so it can't silently reactivate later.
  useEffect(() => {
    if (!canLog && scale === "log") setScale("linear");
  }, [canLog, scale]);

  const m = data.metrics;
  const b = data.benchmark;
  const activeEngine = ENGINES.find((e) => e.key === engine)!;
  const activeMarket = MARKETS.find((mk) => mk.key === market)!;

  const tiles: { label: string; value: string; tone?: keyof typeof TONE; sub?: string }[] = [
    { label: "Total Return", value: fmtPct(m.totalReturnPct), tone: m.totalReturnPct >= 0 ? "cyan" : "rose", sub: `B&H ${fmtPct(b.totalReturnPct)}` },
    { label: "CAGR", value: fmtPct(m.cagrPct), tone: "cyan" },
    { label: "Worst Drawdown", value: fmtPct(m.maxDrawdownPct), tone: "amber", sub: `B&H ${fmtPct(b.maxDrawdownPct)}` },
    { label: "Volatility", value: `${m.volatilityPct.toFixed(1)}%` },
    { label: "Sharpe", value: m.sharpe.toFixed(2), sub: `B&H ${b.sharpe.toFixed(2)}` },
    { label: "Sortino", value: m.sortino.toFixed(2) },
    { label: "Calmar", value: m.calmar.toFixed(2) },
    { label: "Profit Factor", value: m.profitFactor.toFixed(2) },
    { label: "Time in Market", value: `${m.pctInMarket.toFixed(1)}%` },
    { label: "Trades", value: String(m.trades) },
  ];

  return (
    <section id="proof" className="scroll-mt-24 py-28 md:py-32 bg-[#010309] relative z-10 border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[520px] h-[320px] bg-primary/[0.05] blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // Live Proof
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            <DecodeText text="PROOF ON REAL DATA" />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
            Two decades. Three engines. Seven markets. Pick a combination and read the equity
            curve against buy &amp; hold — drawdowns shown as plainly as the gains.
          </p>
          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-primary/50 via-[rgba(168,85,247,0.45)] to-transparent max-w-3xl mx-auto md:mx-0" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="relative border border-primary/20 bg-[#000206] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Engine selector */}
          <div className="border-b border-white/10 p-4 md:p-6">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
              Engine
            </div>
            <div role="group" aria-label="Strategy engine" className="grid grid-cols-3 gap-2">
              {ENGINES.map((e) => {
                const on = e.key === engine;
                return (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => setEngine(e.key)}
                    aria-pressed={on}
                    data-testid={`engine-${e.key}`}
                    className={`group border px-3 py-3 text-left transition-all ${
                      on
                        ? "border-primary/60 bg-primary/[0.08]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`block font-display font-bold text-sm md:text-lg tracking-wide ${on ? "text-primary" : "text-white/80"}`}>
                      {e.name}
                    </span>
                    <span className="block font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/35">
                      {e.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Market selector */}
          <div className="border-b border-white/10 p-4 md:p-6">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
              Market
            </div>
            <div role="group" aria-label="Market" className="flex flex-wrap gap-2">
              {MARKETS.map((mk) => {
                const on = mk.key === market;
                return (
                  <button
                    key={mk.key}
                    type="button"
                    onClick={() => setMarket(mk.key)}
                    aria-pressed={on}
                    data-testid={`market-${mk.key}`}
                    className={`border px-3 py-2 font-mono text-xs tracking-[0.15em] transition-all ${
                      on
                        ? "border-primary/60 bg-primary/[0.1] text-primary"
                        : "border-white/10 bg-white/[0.02] text-white/55 hover:bg-white/[0.04] hover:text-white/80"
                    }`}
                  >
                    {mk.key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="border-b border-white/10 p-4 md:p-6 flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
                Scale
              </div>
              <div role="group" aria-label="Y-axis scale" className="inline-flex border border-white/10">
                {(["linear", "log"] as const).map((s) => {
                  const on = (logActive ? "log" : "linear") === s;
                  const disabled = s === "log" && !canLog;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScale(s)}
                      disabled={disabled}
                      aria-pressed={on}
                      data-testid={`scale-${s}`}
                      className={`px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${
                        on ? "bg-primary/[0.12] text-primary" : "text-white/45 hover:text-white/80"
                      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
                Compare
              </div>
              <div role="group" aria-label="Compare engine" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCompare(null)}
                  aria-pressed={compare === null}
                  data-testid="compare-off"
                  className={`border px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-all ${
                    compare === null
                      ? "border-primary/60 bg-primary/[0.1] text-primary"
                      : "border-white/10 bg-white/[0.02] text-white/55 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  Off
                </button>
                {ENGINES.filter((e) => e.key !== engine).map((e) => {
                  const on = compare === e.key;
                  return (
                    <button
                      key={e.key}
                      type="button"
                      onClick={() => setCompare(e.key)}
                      aria-pressed={on}
                      data-testid={`compare-${e.key}`}
                      className={`border px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-all ${
                        on
                          ? "border-[rgba(168,85,247,0.6)] bg-[rgba(168,85,247,0.12)] text-[rgb(196,150,255)]"
                          : "border-white/10 bg-white/[0.02] text-white/55 hover:bg-white/[0.04] hover:text-white/80"
                      }`}
                    >
                      {e.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display font-bold text-white text-lg tracking-wide">
                  {activeEngine.name} <span className="text-white/30">/</span> {activeMarket.label}
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                  Growth of 100 · {data.startYear}–{data.startYear + Math.round(data.years)} walk-forward · net of fees
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.15em] uppercase">
                <span className="flex items-center gap-2 text-primary">
                  <span className="inline-block h-[2px] w-4 bg-primary" /> Strategy
                </span>
                {compareName && (
                  <span className="flex items-center gap-2 text-[rgb(196,150,255)]">
                    <span className="inline-block h-[2px] w-4 bg-[rgb(168,85,247)]" /> {compareName}
                  </span>
                )}
                <span className="flex items-center gap-2 text-white/45">
                  <span className="inline-block h-[2px] w-4 bg-[#5b6472]" /> Buy &amp; Hold
                </span>
              </div>
            </div>

            <div className="h-[300px] md:h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(190 100% 50%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(190 100% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    interval={Math.max(0, Math.floor(curve.length / 7))}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Menlo, monospace" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    width={44}
                    scale={logActive ? "log" : "auto"}
                    domain={
                      (logActive ? ["auto", "auto"] : [0, "auto"]) as [
                        number | string,
                        number | string,
                      ]
                    }
                    allowDataOverflow={false}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Menlo, monospace" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                  />
                  <Tooltip
                    content={<ChartTooltip compareName={compareName} />}
                    cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="buyHold"
                    stroke="#5b6472"
                    strokeWidth={1.5}
                    fill="none"
                    dot={false}
                    isAnimationActive={false}
                  />
                  {compareData && (
                    <Area
                      type="monotone"
                      dataKey="compare"
                      stroke="rgb(168,85,247)"
                      strokeWidth={1.5}
                      strokeDasharray="5 3"
                      fill="none"
                      dot={false}
                      isAnimationActive={false}
                      connectNulls
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="strategy"
                    stroke="hsl(190 100% 50%)"
                    strokeWidth={2}
                    fill={`url(#${gradId})`}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Brush
                    dataKey="year"
                    height={24}
                    travellerWidth={8}
                    gap={2}
                    stroke="rgba(0,200,255,0.35)"
                    fill="rgba(0,4,8,0.65)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border-t border-white/10">
            {tiles.map((t) => (
              <div key={t.label} className="bg-[#000206] p-4 md:p-5">
                <div className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">
                  {t.label}
                </div>
                <div className={`font-display font-bold text-xl md:text-2xl ${TONE[t.tone ?? "default"]}`}>
                  {t.value}
                </div>
                {t.sub && (
                  <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/25 mt-1">
                    {t.sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-4 md:px-6 py-3 font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-amber-400/70">
            Illustrative — simulated figures for layout. Live walk-forward data to be wired in.
          </div>

          <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
          <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
          <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
          <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
        </motion.div>
      </div>
    </section>
  );
}
