import { DecodeText } from "../ui/decode-text";
import cubeIcon from "@/assets/cube-icon.png";

export function Footer() {
  return (
    <footer className="bg-[#000206] pt-24 pb-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={cubeIcon}
                alt="Obsidian Abyss mark"
                className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
              />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-widest">
                <DecodeText text="OBSIDIAN ABYSS" />
              </h2>
            </div>
            <p className="text-white/40 text-sm max-w-sm">
              Fear keeps you from the truth. The Abyss forces you to confront it.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Platform</span>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Methodology</a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Legal</span>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © 2026 Obsidian Abyss. All rights reserved.
          </p>
          <p className="text-primary/60 text-xs tracking-wider font-mono">
            NOTHING HERE IS FINANCIAL ADVICE.
          </p>
        </div>
      </div>
    </footer>
  );
}
