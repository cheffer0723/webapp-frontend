import { motion } from "framer-motion";
import {
  Route,
  Workflow,
  Boxes,
  FlaskConical,
  Network,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { DecodeText } from "../ui/decode-text";

interface StackItem {
  id: string;
  eyebrow: string;
  title: string;
  role: string;
  icon: LucideIcon;
  href: string;
}

const items: StackItem[] = [
  {
    id: "cerberus",
    eyebrow: "Regime Engine",
    title: "Cerberus",
    role: "Orthrus · Hydra · Sisyphus, on consensus.",
    icon: Boxes,
    href: "#platform",
  },
  {
    id: "charon",
    eyebrow: "Advisor",
    title: "Charon",
    role: "Maps the regime to an engine. You decide.",
    icon: Route,
    href: "#platform",
  },
  {
    id: "flow",
    eyebrow: "Method",
    title: "Flow",
    role: "Ask · Read · Test · Decide.",
    icon: Workflow,
    href: "#platform",
  },
  {
    id: "mirofish",
    eyebrow: "Premium",
    title: "MiroFish",
    role: "The deep-research signal layer.",
    icon: FlaskConical,
    href: "#mirofish",
  },
  {
    id: "x402",
    eyebrow: "Programmatic",
    title: "x402",
    role: "Machine-payable, pay-per-call access.",
    icon: Network,
    href: "#agents",
  },
];

export function PlatformCards() {
  return (
    <section id="stack" className="scroll-mt-24 py-24 md:py-28 bg-[#010309] relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // The Stack
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            <DecodeText text="THE FULL STACK" />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
            The whole abyss at a glance — jump to any layer below. Every one answers to your
            judgment, never replaces it.
          </p>
          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-primary/50 via-[rgba(168,85,247,0.45)] to-transparent max-w-3xl mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {items.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative flex flex-col border border-white/10 bg-white/[0.02] p-5 hover:border-primary/50 hover:bg-primary/[0.04] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.08),transparent_70%)]" />
              <div className="flex items-start justify-between mb-5">
                <c.icon className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors" />
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">
                {c.eyebrow}
              </div>
              <h3 className="text-lg font-display font-bold text-white tracking-wide mb-2">
                {c.title}
              </h3>
              <p className="text-white/45 text-xs leading-relaxed">{c.role}</p>

              <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
