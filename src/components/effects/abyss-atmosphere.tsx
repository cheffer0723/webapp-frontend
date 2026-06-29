import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MAX_DEPTH = 11034; // Challenger Deep, in meters

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  o: number;
  z: number; // parallax depth factor 0..1
  phase: number;
}

export function AbyssAtmosphere() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthValueRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Scroll-driven depth gauge — runs in all motion modes (user-driven, not decorative).
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const depth = Math.round((p * MAX_DEPTH) / 10) * 10;
      if (depthValueRef.current) depthValueRef.current.textContent = `\u2212${depth.toLocaleString()}`;
      if (markerRef.current) markerRef.current.style.top = `${p * 100}%`;
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Marine snow + cursor light — decorative, gated behind reduced motion.
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.max(40, Math.min(150, Math.floor((w * h) / 13000)));
    const parts: Particle[] = Array.from({ length: count }, () => {
      const z = 0.2 + Math.random() * 0.8;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + z * 1.6,
        vy: 5 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 5,
        o: 0.05 + z * 0.32,
        z,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const target = { x: w / 2, y: h * 0.4 };
    const cur = { x: w / 2, y: h * 0.4 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let lastScroll = window.scrollY;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      cur.x += (target.x - cur.x) * Math.min(1, dt * 6);
      cur.y += (target.y - cur.y) * Math.min(1, dt * 6);
      root.style.setProperty("--abyss-x", `${cur.x}px`);
      root.style.setProperty("--abyss-y", `${cur.y}px`);

      const sNow = window.scrollY;
      const sDelta = Math.max(-120, Math.min(120, sNow - lastScroll));
      lastScroll = sNow;

      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.phase += dt;
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(p.phase) * 3) * dt;
        // Descending past the snow: scrolling down pushes particles up (parallax by depth).
        p.y -= sDelta * p.z * 0.6;

        if (p.y - p.r > h) {
          p.y = -p.r;
          p.x = Math.random() * w;
        } else if (p.y + p.r < 0) {
          p.y = h + p.r;
          p.x = Math.random() * w;
        }
        if (p.x > w + 4) p.x = -4;
        else if (p.x < -4) p.x = w + 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 220, 255, ${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!reduced && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--abyss-x, 50%) var(--abyss-y, 40%), rgba(0,200,255,0.07), rgba(168,85,247,0.03) 38%, transparent 72%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Depth gauge — descent meter */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { delay: 0.6, duration: 0.9 }}
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center lg:flex"
      >
        <span className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/45 [writing-mode:vertical-rl] rotate-180">
          Depth
        </span>
        <div className="relative h-40 w-[2px] bg-white/15">
          <div
            ref={fillRef}
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-primary to-violet-400/50"
            style={{ height: "0%" }}
          />
          <div
            ref={markerRef}
            className="absolute -left-[3px] h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,255,255,0.95)]"
            style={{ top: "0%" }}
          />
        </div>
        <div className="mt-3 font-mono text-[10px] tracking-[0.15em] text-primary">
          <span ref={depthValueRef}>{"\u22120"}</span>
          <span className="text-white/40"> M</span>
        </div>
      </motion.div>
    </div>
  );
}
