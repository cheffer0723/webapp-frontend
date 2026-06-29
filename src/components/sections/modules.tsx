import { motion, useReducedMotion } from "framer-motion";
import { Route, Workflow, LineChart, KeyRound } from "lucide-react";
import { DecodeText } from "../ui/decode-text";

const engines = [
  {
    id: "orthrus",
    name: "Orthrus",
    archetype: "Trend-Following",
    status: "VALIDATED",
    color: "#34d399",
    desc: "Rides established direction. Cuts losers fast and lets winners run. Two decades of walk-forward data stand behind it.",
    spark: [0.18, 0.26, 0.21, 0.34, 0.3, 0.46, 0.58, 0.5, 0.66, 0.61, 0.78, 0.9],
  },
  {
    id: "hydra",
    name: "Hydra",
    archetype: "Momentum",
    status: "MIXED",
    color: "#fbbf24",
    desc: "Hunts acceleration. Higher highs, harder falls. Devastating in expansion, punishing in chop. We do not hide the chop.",
    spark: [0.32, 0.55, 0.34, 0.7, 0.4, 0.86, 0.33, 0.64, 0.42, 0.88, 0.5, 0.72],
  },
  {
    id: "sisyphus",
    name: "Sisyphus",
    archetype: "Mean-Reversion",
    status: "NICHE",
    color: "#a78bfa",
    desc: "Fades the extremes. Small, repeatable edges in range-bound markets. The boulder always rolls again.",
    spark: [0.42, 0.47, 0.4, 0.5, 0.43, 0.52, 0.45, 0.53, 0.46, 0.54, 0.47, 0.55],
  },
];

const STATUS_CLS: Record<string, string> = {
  VALIDATED: "text-emerald-400/90 border-emerald-400/30",
  MIXED: "text-amber-400/90 border-amber-400/30",
  NICHE: "text-violet-400/90 border-violet-400/30",
};

const pillars = [
  {
    id: "charon",
    name: "Charon",
    role: "The Advisor",
    icon: Route,
    desc: "Ferries you across. Suggests which engine and mode fit the current regime — then steps back. The decision is yours.",
  },
  {
    id: "flow",
    name: "Flow",
    role: "The Method",
    icon: Workflow,
    desc: "Ask. Read. Test. Decide. A loop that always ends in your judgment, never ours.",
  },
  {
    id: "backtest",
    name: "Backtest",
    role: "The Proof",
    icon: LineChart,
    desc: "~20 years, walk-forward, net of fees. We show the drawdowns as plainly as the gains.",
  },
  {
    id: "custody",
    name: "Non-Custodial",
    role: "The Boundary",
    icon: KeyRound,
    desc: "Your keys. Your capital. No execution, no custody, no counterparty. We never touch it.",
  },
];

function buildSparkPaths(points: number[], w: number, h: number, pad = 5) {
  const n = points.length;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const coords = points.map((p, i) => {
    const x = pad + (innerW * i) / (n - 1);
    const y = pad + innerH * (1 - Math.max(0, Math.min(1, p)));
    return [x, y] as const;
  });
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${coords[n - 1][0].toFixed(1)} ${h - pad} L ${coords[0][0].toFixed(1)} ${h - pad} Z`;
  return { line, area };
}

function Sparkline({
  points,
  color,
  gradId,
}: {
  points: number[];
  color: string;
  gradId: string;
}) {
  const reduced = useReducedMotion();
  const W = 260;
  const H = 70;
  const { line, area } = buildSparkPaths(points, W, H);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function CerberusGraphic() {
  const reduced = useReducedMotion();
  const core = { x: 200, y: 188 };
  const heads = [
    { x: 66, y: 74, label: "ORTHRUS" },
    { x: 200, y: 46, label: "HYDRA" },
    { x: 334, y: 74, label: "SISYPHUS" },
  ];

  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full h-auto"
      role="img"
      aria-label="Cerberus: a three-headed regime engine whose heads are the Orthrus, Hydra and Sisyphus strategies"
    >
      <defs>
        <radialGradient id="cerb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(190 100% 62%)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(190 100% 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={core.x} cy={core.y} r="128" fill="none" stroke="rgba(255,255,255,0.05)" />
      <circle cx={core.x} cy={core.y} r="96" fill="none" stroke="rgba(255,255,255,0.04)" />

      {heads.map((h, i) => (
        <motion.line
          key={h.label}
          x1={core.x}
          y1={core.y}
          x2={h.x}
          y2={h.y}
          stroke="hsl(190 100% 50%)"
          strokeOpacity="0.35"
          strokeWidth="1"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
        />
      ))}

      <circle cx={core.x} cy={core.y} r="48" fill="url(#cerb-core)" />
      <rect
        x={core.x - 9}
        y={core.y - 9}
        width="18"
        height="18"
        transform={`rotate(45 ${core.x} ${core.y})`}
        fill="#010309"
        stroke="hsl(190 100% 62%)"
        strokeWidth="1.5"
      />
      <text
        x={core.x}
        y={core.y + 3}
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        style={{ fontSize: 7, letterSpacing: 2, fontFamily: "monospace" }}
      >
        ALIGN
      </text>

      {heads.map((h, i) => (
        <motion.g
          key={h.label}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
        >
          <rect
            x={h.x - 8}
            y={h.y - 8}
            width="16"
            height="16"
            transform={`rotate(45 ${h.x} ${h.y})`}
            fill="#010309"
            stroke="hsl(190 100% 55%)"
            strokeWidth="1.5"
          />
          <circle cx={h.x} cy={h.y} r="2.5" fill="hsl(190 100% 72%)" />
          <text
            x={h.x}
            y={h.y - 16}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            style={{ fontSize: 9, letterSpacing: 2, fontFamily: "monospace" }}
          >
            {h.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export function Modules() {
  return (
    <section id="platform" className="scroll-mt-24 py-32 bg-[#010309] relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            <DecodeText text="THE ARSENAL" />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
            Tools that refuse to flatter you. The abyss does not console — it reveals. Every
            instrument here is built to show you what is, not the story your fear or greed
            wants to believe.
          </p>
          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-primary/50 via-[rgba(168,85,247,0.45)] to-transparent max-w-3xl mx-auto md:mx-0" />
        </div>

        {/* Cerberus — featured regime engine */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="relative border border-primary/15 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden mb-12"
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,255,0.08),transparent_60%)]" />
          <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12 items-center relative z-10">
            <div>
              <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
                // The Regime Engine
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
                Cerberus
              </h3>
              <p className="text-lg text-white/80 font-light mb-5">
                Three heads. One verdict.
              </p>
              <p className="text-white/55 text-sm md:text-base leading-relaxed">
                A three-headed engine that reads the market's regime — Bull, Bear, or
                Sideways. Each head runs a different discipline. Cerberus only speaks when
                the heads agree, so you act on consensus, not on the hunch your emotions are
                selling you.
              </p>
            </div>
            <div className="relative">
              <CerberusGraphic />
            </div>
          </div>
          <div className="absolute top-0 left-0 w-3 h-[1px] bg-primary/60" />
          <div className="absolute top-0 left-0 w-[1px] h-3 bg-primary/60" />
          <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-primary/60" />
          <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-primary/60" />
        </motion.div>

        {/* The three heads */}
        <div className="mb-6 font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
          The Three Heads
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {engines.map((eng, i) => (
            <motion.div
              key={eng.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all overflow-hidden"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-2xl font-display font-bold text-white tracking-wide">
                  {eng.name}
                </h4>
                <span
                  className={`font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-1 ${STATUS_CLS[eng.status]}`}
                >
                  {eng.status}
                </span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/60 mb-5">
                {eng.archetype}
              </div>

              <div className="mb-5">
                <Sparkline points={eng.spark} color={eng.color} gradId={`spark-${eng.id}`} />
                <div className="mt-2 flex justify-between font-mono text-[9px] tracking-[0.15em] uppercase text-white/25">
                  <span>~20y walk-forward</span>
                  <span>net of fees</span>
                </div>
              </div>

              <p className="text-white/55 text-sm leading-relaxed">{eng.desc}</p>

              <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
            </motion.div>
          ))}
        </div>

        {/* The system */}
        <div className="mb-6 font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
          The System
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group relative border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.08),transparent_70%)]" />
              <p.icon className="w-7 h-7 text-primary/80 group-hover:text-primary transition-colors mb-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]" />
              <h4 className="text-lg font-display font-bold text-white tracking-wide mb-1">
                {p.name}
              </h4>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
                {p.role}
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{p.desc}</p>

              <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
