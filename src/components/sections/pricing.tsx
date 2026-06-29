import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DecodeText } from "../ui/decode-text";
import { scrollToSection } from "@/lib/scroll-to";

export function Pricing() {
  return (
    <section id="access" className="scroll-mt-24 py-32 bg-[#010309] relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[rgba(168,85,247,0.08)] rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            <DecodeText text="THE COST OF TRUTH" />
          </h2>
          <p className="text-white/60 text-lg">One price. Complete access. No illusions.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto bg-[#000206] border border-primary/30 p-10 relative overflow-hidden"
        >
          {/* Neon Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_#00ffff]" />
          
          <div className="text-center mb-10">
            <div className="text-primary font-mono tracking-[0.2em] text-xs mb-4 uppercase">Complete Access</div>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-5xl font-display font-bold text-white tracking-tighter">$9.99</span>
              <span className="text-white/40 mb-2">/mo</span>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {[
              "Full Research Platform Access",
              "20-Year Backtesting Lab",
              "Cerberus Regime Detector",
              "AI Research Companion",
              "Full Data Export & API Access",
              "Priority Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span className="text-white/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <a
            href="mailto:contact@obsidianabyss.com?subject=Requesting%20Access%20to%20Obsidian%20Abyss"
            className="block w-full py-4 text-center bg-primary text-[#010309] font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
          >
            Enter the Abyss
          </a>
        </motion.div>

        <p className="mt-8 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">
          Deploying an agent?{" "}
          <button
            onClick={() => scrollToSection("agents")}
            className="text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            It can pay per call via x402
          </button>
        </p>
      </div>
    </section>
  );
}
