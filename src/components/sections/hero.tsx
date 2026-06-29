import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DecodeText } from "../ui/decode-text";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import heroBg from "@/assets/hero-bg.png";
import { scrollToSection } from "@/lib/scroll-to";

const HeroAbyssScene = lazy(() => import("../effects/hero-abyss-scene"));

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// If the WebGL scene throws at runtime (lost context, driver fault), render
// nothing so the PNG background underneath remains the fallback.
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [use3D, setUse3D] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  // Progressive enhancement: start with the PNG, upgrade to WebGL only when the
  // device can handle it (not reduced-motion, not coarse-pointer/small, has WebGL).
  useEffect(() => {
    if (reduced) {
      setUse3D(false);
      return;
    }
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    setUse3D(!coarse && !small && supportsWebGL());
  }, [reduced]);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-[#010309] flex flex-col justify-center items-center">
      {/* Background Image & Effects */}
      <motion.div 
        style={{ y, opacity, filter: blur, scale }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.7]"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* WebGL abyss — fades in over the PNG once loaded; PNG stays as fallback */}
        {use3D && (
          <SceneErrorBoundary>
            <Suspense fallback={null}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4 }}
                className="absolute inset-0 pointer-events-none"
              >
                <HeroAbyssScene />
              </motion.div>
            </Suspense>
          </SceneErrorBoundary>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] via-[#010309]/95 via-[56%] to-[#010309]" />
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.04),transparent_65%)]" />

        {/* Violet accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(168,85,247,0.06),transparent_55%)]" />

        {/* Vignette for deep abyss darkness */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#010309_92%)]" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8 overflow-hidden"
        >
          <p className="font-tech text-primary/70 text-[10px] md:text-xs tracking-[0.3em] uppercase max-w-2xl">
            Fear keeps you from the truth. The Abyss forces you to confront it.
          </p>
        </motion.div>

        <h1 className="font-display font-extrabold text-white text-[9.6vw] md:text-[9.3vw] leading-none whitespace-nowrap tracking-[0.2em] md:tracking-[0.15em] w-screen max-w-none text-center mb-10 [filter:drop-shadow(0_0_25px_rgba(0,200,255,0.2))_drop-shadow(0_0_45px_rgba(168,85,247,0.16))] pl-[0.2em] md:pl-[0.15em]">
          <DecodeText text="BEAR WITNESS" delay={600} duration={1800} />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="font-tech text-white/50 text-[10px] md:text-xs max-w-2xl mx-auto mb-16 tracking-[0.25em] uppercase leading-loose"
        >
          Descend into market clarity. Regime detection, 20 years of backtested data, non-custodial by design. Signal for humans and the agents they deploy. No comfort.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <button
            onClick={() => scrollToSection("platform")}
            className="px-8 py-4 bg-primary text-[#010309] font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
          >
            Explore the Abyss
          </button>
          <button
            onClick={() => scrollToSection("metrics")}
            className="px-8 py-4 border border-primary/30 text-white font-medium tracking-[0.2em] uppercase text-sm hover:bg-primary/10 transition-colors"
          >
            Learn More
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-primary shadow-[0_0_10px_#00ffff]"
          />
        </div>
      </motion.div>
    </section>
  );
}
