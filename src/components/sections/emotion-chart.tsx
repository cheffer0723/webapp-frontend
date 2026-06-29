import type { TooltipProps } from "recharts";

export const ROSE = "#fb7185";
export const EMERALD = "#34d399";

export const AXIS_TICK = {
  fill: "rgba(255,255,255,0.4)",
  fontSize: 10,
  fontFamily: "Menlo, monospace",
} as const;

export function PriceTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const v = payload[0]?.value;
  return (
    <div className="border border-primary/30 bg-[#000206]/95 px-3 py-2 font-mono text-[11px] shadow-[0_0_30px_rgba(0,200,255,0.1)]">
      <div className="mb-1 text-white/40 tracking-[0.2em] uppercase">{label}</div>
      <div className="text-white">
        SPY {typeof v === "number" ? `$${v.toFixed(2)}` : "-"}
      </div>
    </div>
  );
}
