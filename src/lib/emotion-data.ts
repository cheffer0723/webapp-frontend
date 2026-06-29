export interface SpyPoint {
  date: string;
  price: number;
}

// SPY close prices, June 20-28 2026. Trader entered Jun 20 @ 410.50,
// panic-exited Jun 24 @ 405.00. System held through the dip to Jun 28 @ 420.00.
export const traderSeries: SpyPoint[] = [
  { date: "Jun 20", price: 410.5 },
  { date: "Jun 21", price: 398.2 },
  { date: "Jun 22", price: 401.0 },
  { date: "Jun 23", price: 403.4 },
  { date: "Jun 24", price: 405.0 },
];

export const systemSeries: SpyPoint[] = [
  { date: "Jun 20", price: 410.5 },
  { date: "Jun 21", price: 398.2 },
  { date: "Jun 22", price: 401.0 },
  { date: "Jun 23", price: 403.4 },
  { date: "Jun 24", price: 405.0 },
  { date: "Jun 25", price: 410.0 },
  { date: "Jun 26", price: 415.5 },
  { date: "Jun 27", price: 421.5 },
  { date: "Jun 28", price: 420.0 },
];

export const PRICE_DOMAIN: [number, number] = [396, 424];


export interface TradeStat {
  label: string;
  value: string;
  tag?: string;
  tone?: "loss" | "gain" | "neutral";
}

export const traderTrade: TradeStat[] = [
  { label: "Entry", value: "$410.50" },
  { label: "Exit", value: "$405.00", tag: "PANIC EXIT", tone: "loss" },
  { label: "Return", value: "-1.7%", tone: "loss" },
  { label: "Result", value: "-$700", tone: "loss" },
];

export const systemTrade: TradeStat[] = [
  { label: "Entry", value: "$410.50" },
  { label: "Exit", value: "$420.00", tag: "DISCIPLINED HOLD", tone: "gain" },
  { label: "Return", value: "+2.4%", tone: "gain" },
  { label: "Result", value: "+$190", tone: "gain" },
];

export interface Explanation {
  title: string;
  body: string;
}

export const explanations: Explanation[] = [
  {
    title: "Why panic happened",
    body: "Price dipped 3% on June 21. You thought \u201cthis is going to zero.\u201d You exited immediately instead of holding per your 200-day MA rule.",
  },
  {
    title: "What the system would have done",
    body: "Price above the 200-day MA is a HOLD signal. The system held through the dip and caught the recovery.",
  },
  {
    title: "What happened next",
    body: "June 25-28: the market recovered. You watched from cash, helpless. The system had already cashed out at $420.",
  },
];

export interface MetricRow {
  metric: string;
  emotional: string;
  system: string;
  advantage: string;
}

export const comparisonMetrics: MetricRow[] = [
  { metric: "Avg Return per Trade", emotional: "-2.3%", system: "+4.1%", advantage: "+6.4%" },
  { metric: "Sharpe Ratio (risk-adjusted)", emotional: "0.42", system: "1.84", advantage: "+338%" },
  { metric: "Max Drawdown (worst loss)", emotional: "-22%", system: "-6%", advantage: "73% less pain" },
  { metric: "Win Rate (regime accuracy)", emotional: "\u2014", system: "76%", advantage: "Knowing what\u2019s next" },
];

export interface RegimeForecast {
  symbol: string;
  market: string;
  engine: string;
  status: "IN" | "OUT";
  signal: string;
  confidence: number;
  probability: number;
  outlook: string;
  action: string;
}

export const forecastRegimes: RegimeForecast[] = [
  {
    symbol: "SPY",
    market: "S&P 500",
    engine: "Orthrus",
    status: "IN",
    signal: "Price above 200-day MA",
    confidence: 89,
    probability: 78,
    outlook: "78% probability it stays IN over the next 7 days.",
    action: "HOLD on SPY if you get in now",
  },
  {
    symbol: "QQQ",
    market: "Nasdaq 100",
    engine: "Hydra",
    status: "OUT",
    signal: "6-month momentum negative",
    confidence: 72,
    probability: 65,
    outlook: "65% probability it stays OUT over the next 7 days.",
    action: "STAY OUT of QQQ until momentum turns",
  },
  {
    symbol: "BTC",
    market: "Bitcoin",
    engine: "Orthrus",
    status: "IN",
    signal: "Price above 200-day MA",
    confidence: 84,
    probability: 81,
    outlook: "81% probability it stays IN over the next 7 days.",
    action: "HOLD on BTC, don\u2019t panic on dips",
  },
];

export const csvExample = `symbol,entry_date,exit_date,entry_price,exit_price,size
SPY,2026-06-20,2026-06-24,410.50,405.00,10
BTC,2026-06-25,2026-07-02,42500,48000,0.5`;

const EMOTIONAL_PER_TRADE = -145;
const SYSTEM_PER_TRADE = 189.3;

export interface UploadResult {
  trades: number;
  emotionalCost: number;
  systemGain: number;
  totalGap: number;
}

// Scales the Week-1 demo numbers to whatever row count was uploaded so the
// result feels responsive. At 28 trades it reproduces the canonical example
// (-$4,060 emotional, +$5,300 system, $9,360 gap).
export function simulateUpload(tradeCount: number): UploadResult {
  const trades = Math.max(1, tradeCount);
  const emotionalCost = Math.round(trades * EMOTIONAL_PER_TRADE);
  const systemGain = Math.round(trades * SYSTEM_PER_TRADE);
  return { trades, emotionalCost, systemGain, totalGap: systemGain - emotionalCost };
}

// Counts data rows in a CSV string, dropping an optional header line.
export function parseTradeCount(csv: string): number {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return 0;
  const firstCell = lines[0].split(",")[0] ?? "";
  const hasHeader = lines[0].toLowerCase().includes("symbol") && Number.isNaN(Number(firstCell));
  return hasHeader ? lines.length - 1 : lines.length;
}

export function fmtMoney(n: number): string {
  return `${n < 0 ? "-" : "+"}$${Math.abs(n).toLocaleString()}`;
}
