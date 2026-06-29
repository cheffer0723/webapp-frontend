import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Boxes, Eye, Waypoints } from "lucide-react";
import { DecodeText } from "../ui/decode-text";
import { scrollToSection } from "@/lib/scroll-to";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FEATURES = [
  {
    icon: Boxes,
    title: "Parallel World",
    desc: "Thousands of autonomous agents — each with its own behavior — react, panic, and adapt in real time.",
  },
  {
    icon: Eye,
    title: "God's-Eye Variables",
    desc: "Inject a shock, a headline, or your own thesis and re-run reality from above.",
  },
  {
    icon: Waypoints,
    title: "Probabilistic Futures",
    desc: "Outcomes ranked by likelihood. A distribution of what could happen, never a single comforting answer.",
  },
];

function MiroFishVisual() {
  const reduced = useReducedMotion();
  const gid = useId();
  const W = 480;
  const H = 300;
  const originX = 132;
  const originY = 150;
  const endX = 462;
  const spreads = [-118, -82, -48, -18, 18, 48, 82, 118];

  const dots = useMemo(() => {
    const r = mulberry32(7);
    return Array.from({ length: 48 }, () => ({
      x: 14 + r() * 100,
      y: 40 + r() * 220,
      s: 0.5 + r() * 1.8,
      o: 0.12 + r() * 0.45,
      dur: 2.2 + r() * 3.4,
      begin: r() * 3,
    }));
  }, []);

  const paths = useMemo(
    () =>
      spreads.map((sp) => {
        const ey = originY + sp;
        const c1x = originX + (endX - originX) * 0.35;
        const c2x = originX + (endX - originX) * 0.65;
        return {
          sp,
          d: `M ${originX} ${originY} C ${c1x} ${originY}, ${c2x} ${ey}, ${endX} ${ey}`,
          o: 0.5 - Math.abs(sp) / 320,
        };
      }),
    []
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="MiroFish: a swarm of agents on the left fanning into probability-weighted future paths on the right"
    >
      <defs>
        <linearGradient id={`${gid}-cone`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(190 100% 50%)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(265 90% 65%)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${gid}-origin`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(190 100% 65%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(190 100% 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d={`M ${originX} ${originY} L ${endX} ${originY - 118} L ${endX} ${originY + 118} Z`}
        fill={`url(#${gid}-cone)`}
      />

      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="hsl(190 100% 72%)" fillOpacity={d.o}>
          {!reduced && (
            <animate
              attributeName="fill-opacity"
              values={`${d.o};${(d.o * 0.22).toFixed(3)};${d.o}`}
              dur={`${d.dur}s`}
              begin={`${d.begin}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}

      <line
        x1={originX}
        y1="38"
        x2={originX}
        y2="262"
        stroke="white"
        strokeOpacity="0.12"
        strokeDasharray="2 4"
      />
      <text
        x={originX}
        y="28"
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        style={{ fontSize: 9, letterSpacing: 3, fontFamily: "monospace" }}
      >
        NOW
      </text>

      {paths.map((p, i) => (
        <motion.path
          key={i}
          id={`${gid}-p${i}`}
          d={p.d}
          fill="none"
          stroke={Math.abs(p.sp) < 30 ? "hsl(190 100% 60%)" : "hsl(265 90% 70%)"}
          strokeOpacity={Math.max(0.12, p.o)}
          strokeWidth={Math.abs(p.sp) < 30 ? 1.6 : 1}
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.6, delay: 0.1 + i * 0.08, ease: "easeOut" }}
        />
      ))}

      {!reduced &&
        paths.map((p, i) => {
          const accent = Math.abs(p.sp) < 30 ? "hsl(190 100% 70%)" : "hsl(265 90% 78%)";
          const dur = 3 + i * 0.22;
          const begin = i * 0.45;
          return (
            <circle key={`fx${i}`} r={Math.abs(p.sp) < 30 ? 2.4 : 1.8} fill={accent}>
              <animateMotion
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
                calcMode="linear"
                keyPoints="0;1"
                keyTimes="0;1"
              >
                <mpath href={`#${gid}-p${i}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.82;1"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

      {paths.map((p, i) => {
        const base = Math.max(0.2, p.o);
        return (
          <motion.circle
            key={`e${i}`}
            cx={endX}
            cy={originY + p.sp}
            r="2"
            fill="hsl(265 90% 75%)"
            fillOpacity={base}
            animate={reduced ? undefined : { fillOpacity: [base, 0.95, base] }}
            transition={
              reduced
                ? undefined
                : { duration: 2.6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }
            }
          />
        );
      })}

      {!reduced && (
        <motion.circle
          cx={originX}
          cy={originY}
          fill="none"
          stroke="hsl(190 100% 60%)"
          strokeWidth="1"
          initial={{ r: 6, opacity: 0.5 }}
          animate={{ r: [6, 28], opacity: [0.5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.circle
        cx={originX}
        cy={originY}
        r="22"
        fill={`url(#${gid}-origin)`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.65, 1, 0.65] }}
        transition={reduced ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx={originX}
        cy={originY}
        r="4"
        fill="hsl(190 100% 75%)"
        animate={reduced ? undefined : { opacity: [0.75, 1, 0.75] }}
        transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function MiroFish() {
  return (
    <section
      id="mirofish"
      className="scroll-mt-24 relative bg-[#000206] border-y border-white/5 overflow-hidden py-28"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[500px] bg-[rgba(168,85,247,0.07)] blur-[140px]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-primary/[0.05] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-violet-400/70 mb-4">
              // Premium Add-On — MiroFish
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              <DecodeText text="SIMULATE THE CROWD" />
            </h2>
            <p className="text-lg md:text-xl text-white/85 font-light leading-snug mb-5">
              Your emotional brain wants one story. MiroFish runs ten thousand.
            </p>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
              MiroFish ingests real-world signal and spawns a parallel world of thousands of
              autonomous agents — a synthetic market that thinks, panics, and adapts. Inject
              your own variables from a god's-eye view and watch the futures branch, weighted
              by probability. Not a prediction — a distribution of what could happen, stripped
              of the fiction you want to believe.
            </p>

            <div className="lg:hidden mb-10">
              <MiroFishVisual />
            </div>

            <div className="space-y-5 mb-10">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 border border-violet-400/25 bg-violet-400/5 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-violet-300/90" />
                  </div>
                  <div>
                    <div className="text-white font-display font-semibold tracking-wide text-sm mb-1">
                      {f.title}
                    </div>
                    <div className="text-white/50 text-sm leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={() => scrollToSection("access")}
                className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#010309] bg-gradient-to-r from-primary to-violet-300 hover:to-white transition-all shadow-[0_0_24px_rgba(168,85,247,0.25)]"
              >
                Request Early Access
              </button>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">
                Now in private beta
              </span>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative border border-white/10 bg-white/[0.015] p-6 overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  mirofish.simulate()
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-violet-300/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  10,000 AGENTS
                </span>
              </div>
              <MiroFishVisual />
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
                <span>Synthetic market</span>
                <span>Probability-weighted futures</span>
              </div>
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-violet-400/50" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-violet-400/50" />
              <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-violet-400/50" />
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-violet-400/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
