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
  ReferenceDot,
  ReferenceArea,
} from "recharts";
import { DecodeText } from "../ui/decode-text";
import { PriceTooltip, AXIS_TICK, ROSE, EMERALD } from "./emotion-chart";
import { traderSeries, systemSeries, PRICE_DOMAIN, type SpyPoint } from "@/lib/emotion-data";

function TradeChart({
  data,
  color,
  entry,
  exit,
  exitColor,
  recovery,
}: {
  data: SpyPoint[];
  color: string;
  entry: { x: string; y: number };
  exit: { x: string; y: number; label: string };
  exitColor: string;
  recovery?: [string, string];
}) {
  const gradId = useId();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 28, right: 18, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          width={52}
          domain={PRICE_DOMAIN}
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip content={<PriceTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
        {recovery && (
          <ReferenceArea
            x1={recovery[0]}
            x2={recovery[1]}
            fill="rgba(52,211,153,0.10)"
            stroke="rgba(52,211,153,0.25)"
            strokeDasharray="3 3"
          />
        )}
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
        <ReferenceDot
          x={entry.x}
          y={entry.y}
          r={5}
          fill="#010309"
          stroke={color}
          strokeWidth={2}
          label={{
            value: "ENTRY",
            position: "top",
            fill: "rgba(255,255,255,0.6)",
            fontSize: 9,
            fontFamily: "Menlo, monospace",
          }}
        />
        <ReferenceDot
          x={exit.x}
          y={exit.y}
          r={6}
          fill={exitColor}
          stroke="#010309"
          strokeWidth={2}
          label={{
            value: exit.label,
            position: "top",
            fill: exitColor,
            fontSize: 9,
            fontFamily: "Menlo, monospace",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EmotionProof() {
  return (
    <section
      id="cost"
      className="scroll-mt-24 py-28 md:py-32 bg-[#010309] relative z-10 border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[520px] h-[320px] bg-[rgba(251,113,133,0.05)] blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[520px] h-[320px] bg-[rgba(52,211,153,0.05)] blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 max-w-3xl">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // The Cost of Emotion
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            <DecodeText text="YOU MADE A BAD TRADE YOU KNEW WAS BAD." />
          </h2>
          <p className="text-white/55 text-base md:text-lg leading-relaxed">
            Our regime detection predicted it. You ignored it and lost money. Here is exactly what
            that one emotional decision cost you &mdash; measured in dollars.
          </p>
          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-[rgba(251,113,133,0.5)] via-[rgba(52,211,153,0.4)] to-transparent max-w-3xl" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7 }}
            className="relative border border-[rgba(251,113,133,0.25)] bg-[#000206] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(251,113,133,0.5)] to-transparent" />
            <div className="flex items-center justify-between border-b border-white/10 p-4 md:p-5">
              <div>
                <div className="font-display font-bold text-white text-lg">You &middot; Panic Exit</div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                  SPY &middot; Jun 20 &rarr; Jun 24
                </div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-2xl text-rose-400">-$700</div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                  -1.7%
                </div>
              </div>
            </div>
            <div className="h-[260px] md:h-[300px] w-full p-2">
              <TradeChart
                data={traderSeries}
                color={ROSE}
                entry={{ x: "Jun 20", y: 410.5 }}
                exit={{ x: "Jun 24", y: 405, label: "PANIC" }}
                exitColor={ROSE}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative border border-[rgba(52,211,153,0.25)] bg-[#000206] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(52,211,153,0.5)] to-transparent" />
            <div className="flex items-center justify-between border-b border-white/10 p-4 md:p-5">
              <div>
                <div className="font-display font-bold text-white text-lg">
                  System &middot; Disciplined Hold
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                  SPY &middot; Jun 20 &rarr; Jun 28
                </div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-2xl text-emerald-400">+$190</div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                  +2.4%
                </div>
              </div>
            </div>
            <div className="h-[260px] md:h-[300px] w-full p-2">
              <TradeChart
                data={systemSeries}
                color={EMERALD}
                entry={{ x: "Jun 20", y: 410.5 }}
                exit={{ x: "Jun 28", y: 420, label: "HOLD / EXIT" }}
                exitColor={EMERALD}
                recovery={["Jun 24", "Jun 28"]}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 relative border border-primary/30 bg-[#000206] p-6 md:p-8 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
            The difference between fear and discipline
          </div>
          <div className="font-display font-bold text-4xl md:text-6xl text-white">
            <span className="text-primary">$890</span> left on the table
          </div>
          <p className="mt-3 text-white/50 text-sm">
            One trade. One panic. The recovery you sold into is shaded in green.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
