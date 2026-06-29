import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { DecodeText } from "../ui/decode-text";
import { useDemoAccess } from "@/context/demo-access-context";
import { forecastRegimes } from "@/lib/emotion-data";
import { scrollToSection } from "@/lib/scroll-to";

function MemberForecast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecastRegimes.map((r) => {
          const inMarket = r.status === "IN";
          const accent = inMarket ? "text-emerald-400" : "text-rose-400";
          const border = inMarket
            ? "border-[rgba(52,211,153,0.25)]"
            : "border-[rgba(251,113,133,0.25)]";
          const bar = inMarket ? "bg-emerald-400" : "bg-rose-400";
          return (
            <div key={r.symbol} className={`relative border ${border} bg-[#000206] p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-display font-bold text-white text-xl">{r.symbol}</div>
                  <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/35">
                    {r.market}
                  </div>
                </div>
                <div
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 border ${border} ${accent}`}
                >
                  {r.engine} {r.status}
                </div>
              </div>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-4">
                {r.signal}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-mono text-[9px] tracking-[0.15em] uppercase text-white/35 mb-1">
                    <span>Confidence</span>
                    <span className={accent}>{r.confidence}%</span>
                  </div>
                  <div className="h-1 bg-white/10">
                    <div className={`h-full ${bar}`} style={{ width: `${r.confidence}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-[9px] tracking-[0.15em] uppercase text-white/35 mb-1">
                    <span>7-day outlook</span>
                    <span className={accent}>{r.probability}%</span>
                  </div>
                  <div className="h-1 bg-white/10">
                    <div className={`h-full ${bar}`} style={{ width: `${r.probability}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-white/55 text-xs leading-relaxed">
                {r.outlook}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border border-primary/20 bg-[#000206] p-5 md:p-6">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary/70 mb-3">
          What this means for your next trade
        </div>
        <ul className="space-y-2.5">
          {forecastRegimes.map((r) => (
            <li key={r.symbol} className="flex items-start gap-3 text-white/70 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
              <span>
                <span className="text-white font-semibold">{r.symbol}:</span> {r.action} (
                {r.probability}% probability)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ForecastTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative border border-primary/20 bg-[#000206] p-8 md:p-14 text-center overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20 blur-sm pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="grid grid-cols-3 gap-4 p-8">
          {forecastRegimes.map((r) => (
            <div key={r.symbol} className="border border-white/10 h-32" />
          ))}
        </div>
      </div>
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-primary/30 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <p className="text-white/75 text-lg mb-2">
          Traders who use the system know what the market will do over the next 7 days.
        </p>
        <p className="text-white/45 text-sm mb-6">
          SPY, QQQ and BTC regime status &mdash; confidence, probability, and the move to make.
        </p>
        <button
          type="button"
          data-testid="forecast-request-access"
          onClick={() => scrollToSection("access")}
          className="inline-block py-3.5 px-8 bg-primary text-[#010309] font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
        >
          Request Access to See the Forecast
        </button>
      </div>
    </motion.div>
  );
}

export function EmotionForecast() {
  const { hasAccess, setHasAccess } = useDemoAccess();
  return (
    <section
      id="forecast"
      className="scroll-mt-24 py-20 md:py-28 bg-[#010309] relative z-10 border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[480px] h-[300px] bg-primary/[0.05] blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
              // 7-Day Market Forecast
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              <DecodeText
                text={hasAccess ? "CURRENT MARKET REGIME STATUS" : "SEE THE 7-DAY FORECAST"}
              />
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
              Demo access
            </span>
            <div
              role="group"
              aria-label="Demo access state"
              className="inline-flex border border-white/10"
            >
              <button
                type="button"
                data-testid="access-visitor"
                onClick={() => setHasAccess(false)}
                aria-pressed={!hasAccess}
                className={`px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-all ${
                  !hasAccess ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                Visitor
              </button>
              <button
                type="button"
                data-testid="access-member"
                onClick={() => setHasAccess(true)}
                aria-pressed={hasAccess}
                className={`px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-all ${
                  hasAccess ? "bg-primary/[0.12] text-primary" : "text-white/40 hover:text-white/70"
                }`}
              >
                Beta Invite
              </button>
            </div>
          </div>
        </div>

        {hasAccess ? <MemberForecast /> : <ForecastTeaser />}
      </div>
    </section>
  );
}
