import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DecodeText } from "../ui/decode-text";

type Seg = { text: string; cls: string };

const SCRIPT: Seg[][] = [
  [
    { text: "$ ", cls: "text-white/30" },
    { text: "cerberus.read()", cls: "text-white" },
  ],
  [
    { text: "regime", cls: "text-primary" },
    { text: "      walk-forward validated", cls: "text-white/80" },
  ],
  [
    { text: "engines", cls: "text-primary" },
    { text: "     orthrus / hydra / sisyphus", cls: "text-white/80" },
  ],
  [
    { text: "markets", cls: "text-primary" },
    { text: "     SPY QQQ NVDA GLD IWM TLT BTC", cls: "text-white/80" },
  ],
  [
    { text: "window", cls: "text-primary" },
    { text: "      ~20y   ", cls: "text-white/80" },
    { text: "fees modeled", cls: "text-primary/60" },
    { text: "   ", cls: "text-white/80" },
    { text: "losses shown", cls: "text-amber-400/90" },
  ],
  [
    { text: "ok", cls: "text-primary" },
    { text: "          read-only. no custody. no execution.", cls: "text-white/55" },
  ],
  [
    { text: "$ ", cls: "text-white/30" },
    { text: "members -> live read + backtest desk", cls: "text-white" },
  ],
];

const LINE_LENGTHS = SCRIPT.map((line) =>
  line.reduce((sum, seg) => sum + seg.text.length, 0)
);
const TOTAL_CHARS = LINE_LENGTHS.reduce((a, b) => a + b, 0);

const TICKER: { sym: string; state: "BULL" | "BEAR" | "SIDEWAYS" }[] = [
  { sym: "SPY", state: "BULL" },
  { sym: "QQQ", state: "BULL" },
  { sym: "NVDA", state: "BULL" },
  { sym: "GLD", state: "SIDEWAYS" },
  { sym: "IWM", state: "BEAR" },
  { sym: "TLT", state: "BEAR" },
  { sym: "BTC", state: "BULL" },
];

const STATE_CLS: Record<string, string> = {
  BULL: "text-emerald-400/90",
  BEAR: "text-rose-400/90",
  SIDEWAYS: "text-amber-400/90",
};

function TickerRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden}>
      {TICKER.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-2 pr-10 font-mono text-xs tracking-[0.2em] uppercase"
        >
          <span className="text-white/70">{t.sym}</span>
          <span className={STATE_CLS[t.state]}>{t.state}</span>
          <span className="text-white/15">/</span>
        </span>
      ))}
    </div>
  );
}

function Ticker() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="border-y border-white/5 bg-black/40 py-3 overflow-hidden">
        <div className="flex justify-center">
          <TickerRow />
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-white/5 bg-black/40 py-3 overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
      >
        <TickerRow />
        <TickerRow ariaHidden />
      </motion.div>
    </div>
  );
}

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15%" });
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (reduced) {
      setRevealed(TOTAL_CHARS);
      return;
    }
    if (!inView) return;

    let cancelled = false;
    let n = 0;
    let id: ReturnType<typeof setTimeout>;
    setRevealed(0);

    const loop = () => {
      if (cancelled) return;
      if (n < TOTAL_CHARS) {
        n += 1;
        setRevealed(n);
        id = setTimeout(loop, 26);
      } else {
        id = setTimeout(() => {
          if (cancelled) return;
          n = 0;
          setRevealed(0);
          id = setTimeout(loop, 26);
        }, 2800);
      }
    };

    id = setTimeout(loop, 500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [inView, reduced]);

  let acc = 0;
  let activeLine = SCRIPT.length - 1;
  for (let i = 0; i < SCRIPT.length; i++) {
    if (revealed <= acc + LINE_LENGTHS[i]) {
      activeLine = i;
      break;
    }
    acc += LINE_LENGTHS[i];
  }

  let remaining = revealed;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className="relative max-w-2xl mx-auto bg-[#000206] border border-primary/20 overflow-hidden shadow-[0_0_60px_rgba(0,200,255,0.06)]"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </span>
          <span className="font-mono text-xs text-white/50 tracking-wide">
            cerberus — regime engine
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-emerald-400/90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="px-5 py-6 font-mono text-[13px] md:text-sm leading-relaxed">
        {SCRIPT.map((line, li) => {
          const segs: ReactNode[] = [];
          for (let si = 0; si < line.length; si++) {
            const seg = line[si];
            const take = reduced
              ? seg.text.length
              : Math.min(seg.text.length, Math.max(0, remaining));
            if (!reduced) remaining -= take;
            segs.push(
              <span key={si} className={seg.cls}>
                {seg.text.slice(0, take)}
              </span>
            );
          }
          const showCursor = !reduced && li === activeLine;
          return (
            <div key={li} className="min-h-[1.5em] whitespace-pre">
              {segs}
              {showCursor && (
                <span className="inline-block w-[0.55em] h-[0.95em] translate-y-[0.12em] bg-primary/80 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
    </motion.div>
  );
}

export function LiveEngine() {
  return (
    <section
      id="engine"
      className="scroll-mt-24 relative bg-[#010309] overflow-hidden border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-[rgba(168,85,247,0.06)] blur-[120px]" />
      </div>

      <Ticker />

      <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // Cerberus — Regime Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            <DecodeText text="READ THE REGIME" />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed">
            Cerberus reads what state the market is in. Three engines, ~20 years of real
            data, net of fees — losses shown. Read-only. No custody. No execution.
          </p>
        </div>

        <Terminal />
      </div>
    </section>
  );
}
