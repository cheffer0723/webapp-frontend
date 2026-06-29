import { motion } from "framer-motion";
import { DecodeText } from "../ui/decode-text";
import { comparisonMetrics } from "@/lib/emotion-data";

export function EmotionMetrics() {
  return (
    <section className="scroll-mt-24 py-20 md:py-28 bg-[#010309] relative z-10 border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // Emotional vs System
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            <DecodeText text="THE NUMBERS DON'T PANIC" />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed">
            Aggregate performance across uploaded trades. Same markets, same windows &mdash; one set
            of decisions ruled by fear, the other by regime.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="relative border border-primary/20 bg-[#000206] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 p-4 md:p-5">
                    Metric
                  </th>
                  <th className="text-right font-mono text-[10px] tracking-[0.2em] uppercase text-rose-400/80 p-4 md:p-5">
                    Emotional Trading
                  </th>
                  <th className="text-right font-mono text-[10px] tracking-[0.2em] uppercase text-emerald-400/80 p-4 md:p-5">
                    System Trading
                  </th>
                  <th className="text-right font-mono text-[10px] tracking-[0.2em] uppercase text-primary/80 p-4 md:p-5">
                    Advantage
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((row) => (
                  <tr
                    key={row.metric}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 md:p-5 font-display font-semibold text-white text-sm">
                      {row.metric}
                    </td>
                    <td className="p-4 md:p-5 text-right font-display font-bold text-rose-400">
                      {row.emotional}
                    </td>
                    <td className="p-4 md:p-5 text-right font-display font-bold text-emerald-400">
                      {row.system}
                    </td>
                    <td className="p-4 md:p-5 text-right font-mono text-xs tracking-[0.1em] text-primary">
                      {row.advantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="mt-6 text-white/45 text-sm leading-relaxed max-w-3xl">
          These figures come from real traders who uploaded their trades. Emotional traders left
          money on the table. System traders made money by{" "}
          <span className="text-white/80">knowing what was coming next</span>.
        </p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.15em] uppercase text-amber-400/70">
          Illustrative &mdash; simulated aggregates for layout. Live data wired Week 2.
        </p>
      </div>
    </section>
  );
}
