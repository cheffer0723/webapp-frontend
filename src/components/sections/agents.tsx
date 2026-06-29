import { motion } from "framer-motion";
import { Binary, Coins, KeyRound, ScanEye } from "lucide-react";
import { DecodeText } from "../ui/decode-text";
import { scrollToSection } from "@/lib/scroll-to";

const HANDSHAKE: { t: string; c: string }[][] = [
  [
    { t: "$ ", c: "text-white/30" },
    { t: "agent ", c: "text-primary/80" },
    { t: "GET /v1/cerberus/regime", c: "text-white" },
  ],
  [
    { t: "< ", c: "text-white/30" },
    { t: "402 PAYMENT REQUIRED", c: "text-amber-400/90" },
  ],
  [
    { t: "  price    ", c: "text-white/40" },
    { t: "0.01 USDC", c: "text-white/85" },
    { t: "   on Base", c: "text-white/40" },
  ],
  [
    { t: "  pay-to   ", c: "text-white/40" },
    { t: "0xAb3f…c91e", c: "text-white/85" },
    { t: "   scheme exact", c: "text-white/40" },
  ],
  [
    { t: "> ", c: "text-white/30" },
    { t: "X-PAYMENT ", c: "text-primary/80" },
    { t: "<signed authorization>", c: "text-white/70" },
  ],
  [
    { t: "$ ", c: "text-white/30" },
    { t: "agent ", c: "text-primary/80" },
    { t: "GET /v1/cerberus/regime", c: "text-white/70" },
    { t: "   retry", c: "text-white/40" },
  ],
  [
    { t: "< ", c: "text-white/30" },
    { t: "200 OK", c: "text-emerald-400/90" },
  ],
  [
    { t: "  regime   ", c: "text-white/40" },
    { t: "BEAR", c: "text-rose-400/90" },
    { t: "   confidence 0.71", c: "text-white/60" },
  ],
  [
    { t: "  settled  ", c: "text-white/40" },
    { t: "no account · no custody · no human", c: "text-white/55" },
  ],
];

const FEATURES = [
  {
    icon: Binary,
    title: "402 Native",
    desc: "The endpoint answers in the protocol's own tongue — payment required, then signal delivered. No portal, no paperwork.",
  },
  {
    icon: Coins,
    title: "Stablecoin Settlement",
    desc: "USDC on Base, wallet-to-wallet, at the instant of the ask. The machine pays for exactly what it reads.",
  },
  {
    icon: KeyRound,
    title: "No Account, No Custody",
    desc: "No login to provision, no API key to leak, no funds held. Your keys, your agent, your call.",
  },
  {
    icon: ScanEye,
    title: "One Truth, Either Way",
    desc: "Human or machine, the abyss returns the same regime read. No softer reality sold to anyone.",
  },
];

function Handshake() {
  return (
    <div
      role="img"
      aria-label="Illustrative x402 payment handshake: an agent request returns HTTP 402 Payment Required, the agent pays in USDC on Base, retries, and receives the regime signal."
      className="relative border border-primary/20 bg-[#000206] overflow-hidden shadow-[0_0_60px_rgba(0,200,255,0.06)]"
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
            x402 — payment handshake
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-amber-400/90">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          402
        </span>
      </div>

      <div className="px-5 py-6 font-mono text-[11px] md:text-[13px] leading-relaxed">
        {HANDSHAKE.map((line, li) => (
          <div key={li} className="min-h-[1.5em] whitespace-pre-wrap break-words">
            {line.map((seg, si) => (
              <span key={si} className={seg.c}>
                {seg.t}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
        // illustrative — example endpoint, price &amp; address
      </div>

      <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary/50" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary/50" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary/50" />
    </div>
  );
}

export function Agents() {
  return (
    <section
      id="agents"
      className="scroll-mt-24 relative bg-[#010309] border-t border-white/5 overflow-hidden py-28"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[520px] h-[460px] bg-primary/[0.06] blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[320px] bg-[rgba(168,85,247,0.06)] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center"
        >
          <div>
            <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
              // x402 — Machine-Payable API
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              <DecodeText text="PAY PER SIGNAL" />
            </h2>
            <p className="text-lg md:text-xl text-white/85 font-light leading-snug mb-5">
              The abyss does not care who is asking — you, or the agent you sent in your
              place.
            </p>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
              Obsidian Abyss is built to speak <span className="text-white/80">x402</span> — the
              open payment protocol on HTTP 402 — so every signal can be priced and paid for by
              machine. An autonomous agent requests a read, is quoted a price, settles it in USDC
              on Base wallet-to-wallet, and retries — no human in the loop. No keys handed over, no
              account, no custody. The machine transacts; the truth comes back the same.
            </p>

            <div className="lg:hidden mb-10">
              <Handshake />
            </div>

            <div className="space-y-5 mb-10">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 border border-primary/25 bg-primary/5 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-primary/90" />
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
                className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#010309] bg-primary hover:bg-white transition-all shadow-[0_0_24px_rgba(0,255,255,0.25)]"
              >
                Request API Access
              </button>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">
                x402 access · private beta
              </span>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <Handshake />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
