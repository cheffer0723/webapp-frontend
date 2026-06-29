import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-_";
const SCRAMBLE_INTERVAL = 55;

function scramble(text: string, revealCount = 0) {
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (i < revealCount) return text[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

export function DecodeText({
  text,
  className,
  delay = 0,
  duration = 1000,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const [displayText, setDisplayText] = useState(() => scramble(text));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      return;
    }

    let startTime: number;
    let lastScramble = -Infinity;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      let revealCount = 0;
      if (elapsed > delay) {
        const progress = Math.min((elapsed - delay) / duration, 1);
        // easeOutCubic for a smooth, decelerating reveal
        const eased = 1 - Math.pow(1 - progress, 3);
        revealCount = Math.round(eased * text.length);
      }

      // Throttle the random scramble so it reads as smooth rather than twitchy
      if (timestamp - lastScramble >= SCRAMBLE_INTERVAL || revealCount >= text.length) {
        lastScramble = timestamp;
        setDisplayText(scramble(text, revealCount));
      }

      if (elapsed < delay + duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [text, isInView, delay, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      aria-label={text}
      data-testid={`decode-text-${text.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <span aria-hidden="true">{displayText}</span>
    </motion.span>
  );
}
