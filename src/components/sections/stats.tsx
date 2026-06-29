import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ value, label }: { value: number | string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(0);

  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
  const prefix = typeof value === 'string' && value.startsWith('~') ? '~' : '';

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * numericValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
        {prefix}{count}
      </div>
      <div className="text-xs tracking-[0.2em] uppercase text-primary font-mono text-center">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section id="metrics" className="scroll-mt-24 py-24 bg-[#000206] relative border-y border-white/5 overflow-hidden">
      {/* Background network effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,255,255,0.5) 1px, transparent 0)',
             backgroundSize: '40px 40px' 
           }} 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8"
        >
          <AnimatedCounter value={3} label="Research Engines" />
          <AnimatedCounter value={7} label="Market Pairs" />
          <AnimatedCounter value="~20" label="Years Verified Data" />
          <AnimatedCounter value={0} label="Custody Risk" />
        </motion.div>
      </div>
    </section>
  );
}
