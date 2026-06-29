import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "oa-intro-seen";

function hasSeenIntro() {
  try {
    return !!sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable — intro simply replays on next load */
  }
}

export function IntroReveal() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).has("nointro")
    )
      return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !hasSeenIntro();
  });

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setVisible(false);
      markIntroSeen();
    }, 1700);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={() => { document.body.style.overflow = ""; }}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#010309] flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          {/* Faint atmospheric glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.05),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(168,85,247,0.05),transparent_55%)]" />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-tech text-primary/70 text-[10px] md:text-xs tracking-[0.5em] uppercase mb-6 relative"
          >
            Entering the Abyss
          </motion.div>

          <div className="relative h-[1px] w-44 overflow-hidden bg-white/5">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-[rgba(0,200,255,0.9)] to-[rgba(168,85,247,0.9)] shadow-[0_0_14px_rgba(0,200,255,0.6)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
