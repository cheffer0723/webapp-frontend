import { useId } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceDot,
} from "recharts";
import { DecodeText } from "../ui/decode-text";
import { PriceTooltip, AXIS_TICK, ROSE, EMERALD } from "./emotion-chart";
import {
  systemSeries,
  PRICE_DOMAIN,
  traderTrade,
  systemTrade,
  explanations,
  type TradeStat,
} from "@/lib/emotion-data";

function toneClass(tone?: TradeStat["tone"]): string {
  if (tone === "loss") return "text-rose-400";
  if (tone === "gain") return "text-emerald-400";
  return "text-white";
}

function TradeColumn({
  title,
  subtitle,
  rows,
  accent,
}: {
  title: string;
  subtitle: string;
  rows: TradeStat[];
  accent: string;
}) {
  return (
    <div>
      <div className="mb-4">
        <div className={`font-display font-bold text-sm ${accent}`}>{title}</div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
          {subtitle}
        </div>
      </div>
      <dl className="space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5"
          >
            <dt className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/40">
              {r.label}
            </dt>
            <dd className={`font-display font-bold text-sm ${toneClass(r.tone)}`}>
              {r.value}
              {r.tag && (
                <span className="ml-1.5 font-mono text-[8px] tracking-[0.12em] uppercase text-white/30">
                  {r.tag}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EmotionTradeBreakdown() {
  const gradId = useId();
  return (
    <section className="scroll-mt-24 py-20 md:py-28 bg-[#010309] relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // Example Trade Breakdown
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
            <DecodeText text="ANATOMY OF A $890 MISTAKE" />
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="relative border border-primary/20 bg-[#000206] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="border-b border-white/10 p-5 md:p-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display font-bold text-white text-xl">
                SPY <span className="text-white/30">|</span> June 20-24, 2026
              </div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                Long &middot; 200-day MA regime rule
              </div>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[rgba(251,113,133,0.4)] text-rose-400">
              Cost of emotion &middot; -$890
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
            <div className="bg-[#000206] p-5 md:p-6">
              <div className="grid grid-cols-2 gap-5">
                <TradeColumn
                  title="YOUR TRADE"
                  subtitle="Emotional"
                  rows={traderTrade}
                  accent="text-rose-400"
                />
                <TradeColumn
                  title="SYSTEM TRADE"
                  subtitle="Disciplined"
                  rows={systemTrade}
                  accent="text-emerald-400"
                />
              </div>
            </div>

            <div className="bg-[#000206] p-5 md:p-6">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-3">
                Dip &rarr; recovery (the gap you sold)
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={systemSeries} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={EMERALD} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      interval={1}
                      tick={AXIS_TICK}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickLine={false}
                    />
                    <YAxis
                      width={48}
                      domain={PRICE_DOMAIN}
                      tick={AXIS_TICK}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `$${v}`}
                    />
                    <Tooltip
                      content={<PriceTooltip />}
                      cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                    />
                    <ReferenceArea
                      x1="Jun 24"
                      x2="Jun 28"
                      fill="rgba(52,211,153,0.10)"
                      stroke="rgba(52,211,153,0.25)"
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={EMERALD}
                      strokeWidth={2}
                      fill={`url(#${gradId})`}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <ReferenceDot
                      x="Jun 24"
                      y={405}
                      r={5}
                      fill={ROSE}
                      stroke="#010309"
                      strokeWidth={2}
                      label={{
                        value: "YOU SOLD",
                        position: "bottom",
                        fill: ROSE,
                        fontSize: 9,
                        fontFamily: "Menlo, monospace",
                      }}
                    />
                    <ReferenceDot
                      x="Jun 28"
                      y={420}
                      r={5}
                      fill={EMERALD}
                      stroke="#010309"
                      strokeWidth={2}
                      label={{
                        value: "SYSTEM EXIT",
                        position: "top",
                        fill: EMERALD,
                        fontSize: 9,
                        fontFamily: "Menlo, monospace",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border-t border-white/10">
            {explanations.map((e) => (
              <div key={e.title} className="bg-[#000206] p-5 md:p-6">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/70 mb-2">
                  {e.title}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{e.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
