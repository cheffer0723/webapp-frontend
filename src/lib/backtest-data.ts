// NOTE: All figures below are SIMULATED / illustrative, generated deterministically
// for layout purposes. No live market or Railway data is fetched. Real walk-forward
// results are intended to be wired in later via a static snapshot or API.

export type EngineKey = "orthrus" | "hydra" | "sisyphus";
export type MarketKey = "SPY" | "QQQ" | "NVDA" | "GLD" | "IWM" | "TLT" | "BTC";

export interface EngineInfo {
  key: EngineKey;
  name: string;
  type: string;
  tagline: string;
}

export interface MarketInfo {
  key: MarketKey;
  label: string;
}

export const ENGINES: EngineInfo[] = [
  { key: "orthrus", name: "Orthrus", type: "Trend-Following", tagline: "Follows the dominant current." },
  { key: "hydra", name: "Hydra", type: "Momentum", tagline: "Hunts acceleration." },
  { key: "sisyphus", name: "Sisyphus", type: "Mean-Reversion", tagline: "Fades the extremes." },
];

export const MARKETS: MarketInfo[] = [
  { key: "SPY", label: "S&P 500" },
  { key: "QQQ", label: "Nasdaq 100" },
  { key: "NVDA", label: "NVIDIA" },
  { key: "GLD", label: "Gold" },
  { key: "IWM", label: "Russell 2000" },
  { key: "TLT", label: "Treasuries" },
  { key: "BTC", label: "Bitcoin" },
];

export interface Metrics {
  totalReturnPct: number;
  cagrPct: number;
  maxDrawdownPct: number;
  volatilityPct: number;
  sharpe: number;
  sortino: number;
  calmar: number;
  profitFactor: number;
  pctInMarket: number;
  trades: number;
}

export interface Benchmark {
  totalReturnPct: number;
  maxDrawdownPct: number;
  sharpe: number;
}

export interface CurvePoint {
  year: string;
  strategy: number;
  buyHold: number;
}

export interface BacktestResult {
  metrics: Metrics;
  benchmark: Benchmark;
  curve: CurvePoint[];
  startYear: number;
  years: number;
}

const MARKET_PROFILE: Record<MarketKey, { ret: number; vol: number; start: number }> = {
  SPY: { ret: 0.105, vol: 0.16, start: 2005 },
  QQQ: { ret: 0.15, vol: 0.22, start: 2005 },
  NVDA: { ret: 0.32, vol: 0.45, start: 2005 },
  GLD: { ret: 0.08, vol: 0.15, start: 2005 },
  IWM: { ret: 0.1, vol: 0.2, start: 2005 },
  TLT: { ret: 0.04, vol: 0.14, start: 2005 },
  BTC: { ret: 0.6, vol: 0.8, start: 2014 },
};

const ENGINE_WINDOW: Record<EngineKey, number> = {
  orthrus: 10,
  hydra: 6,
  sisyphus: 12,
};

const END_YEAR = 2025;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

// Approximate historical drawdown windows. Each event is a sharp multi-month
// decline followed by a partial recovery, so long-run drift is preserved (crashes
// are temporary dips, not permanent losses) while drawdowns stay visible.
interface CrashEvent {
  year: number;
  month: number; // 0 = Jan
  len: number;
  sev: number; // per-month log decline at beta = 1
}

const CRASH_EVENTS: CrashEvent[] = [
  { year: 2008, month: 8, len: 6, sev: 0.115 },
  { year: 2020, month: 1, len: 2, sev: 0.18 },
  { year: 2022, month: 0, len: 9, sev: 0.032 },
];

const RECOVER_FRAC = 0.75;

function buildCrashOverlay(startYear: number, months: number, vol: number): number[] {
  const beta = clamp(vol / 0.16, 0.4, 3);
  const overlay = new Array<number>(months).fill(0);
  for (const ev of CRASH_EVENTS) {
    const startIdx = (ev.year - startYear) * 12 + ev.month;
    if (startIdx + ev.len <= 0 || startIdx >= months) continue;
    const sev = ev.sev * beta;
    let lost = 0;
    for (let k = 0; k < ev.len; k++) {
      const idx = startIdx + k;
      if (idx >= 0 && idx < months) {
        overlay[idx] -= sev;
        lost += sev;
      }
    }
    const recLen = ev.len * 2;
    const recPer = (RECOVER_FRAC * lost) / recLen;
    for (let k = 0; k < recLen; k++) {
      const idx = startIdx + ev.len + k;
      if (idx >= 0 && idx < months) overlay[idx] += recPer;
    }
  }
  return overlay;
}

function toEquity(simple: number[]): number[] {
  const eq: number[] = [];
  let v = 100;
  for (const r of simple) {
    v *= 1 + r;
    eq.push(v);
  }
  return eq;
}

function maxDrawdown(eq: number[]): number {
  let peak = -Infinity;
  let mdd = 0;
  for (const v of eq) {
    if (v > peak) peak = v;
    const dd = v / peak - 1;
    if (dd < mdd) mdd = dd;
  }
  return mdd * 100;
}

function annualized(simple: number[]): { vol: number; sharpe: number; sortino: number } {
  const n = simple.length;
  const mean = simple.reduce((a, b) => a + b, 0) / n;
  const variance = simple.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  const downside = Math.sqrt(simple.reduce((a, b) => a + (b < 0 ? b * b : 0), 0) / n);
  const annVol = sd * Math.sqrt(12);
  const sharpe = annVol ? (mean * 12) / annVol : 0;
  const sortino = downside ? (mean * 12) / (downside * Math.sqrt(12)) : 0;
  return { vol: annVol, sharpe, sortino };
}

function profitFactor(simple: number[]): number {
  let gains = 0;
  let losses = 0;
  for (const r of simple) {
    if (r > 0) gains += r;
    else losses += -r;
  }
  return losses ? gains / losses : gains;
}

const round1 = (x: number): number => Math.round(x * 10) / 10;
const round2 = (x: number): number => Math.round(x * 100) / 100;

export function getBacktest(engine: EngineKey, market: MarketKey): BacktestResult {
  const prof = MARKET_PROFILE[market];
  const window = ENGINE_WINDOW[engine];
  // Seed the price path by market ONLY, so buy & hold is identical across engines
  // (the engine choice changes only the strategy overlay, never the benchmark).
  const rng = mulberry32(hashSeed(market));
  const months = (END_YEAR - prof.start) * 12;
  const driftM = Math.log(1 + prof.ret) / 12;
  const volM = prof.vol / Math.sqrt(12);
  const feeSide = market === "BTC" ? 0.004 : 0.0003;

  // Buy & hold log returns -> price series (normalized to 100).
  // De-mean the random shocks so the path's terminal value is anchored to drift +
  // crash overlay. This keeps realistic month-to-month volatility and drawdowns, but
  // prevents a single lucky/unlucky 20-year noise path from landing at an implausible
  // total (e.g. small-caps ending negative, or treasuries up 500%).
  const noise: number[] = [];
  for (let i = 0; i < months; i++) noise.push(gauss(rng));
  const noiseMean = noise.reduce((a, b) => a + b, 0) / months;
  const overlay = buildCrashOverlay(prof.start, months, prof.vol);
  const logr: number[] = [];
  for (let i = 0; i < months; i++) {
    logr.push(driftM + volM * (noise[i] - noiseMean) + overlay[i]);
  }
  const price: number[] = [];
  let cum = 0;
  for (let i = 0; i < months; i++) {
    cum += logr[i];
    price.push(100 * Math.exp(cum));
  }

  // Trailing simple moving average of price.
  const sma: number[] = [];
  for (let i = 0; i < months; i++) {
    const from = Math.max(0, i - window + 1);
    let sum = 0;
    let cnt = 0;
    for (let k = from; k <= i; k++) {
      sum += price[k];
      cnt++;
    }
    sma.push(sum / cnt);
  }

  const bhSimple: number[] = logr.map((r) => Math.exp(r) - 1);

  // Strategy: act on prior-month signal, sit in cash otherwise.
  const stratSimple: number[] = [];
  let prevIn = false;
  let entries = 0;
  let inMonths = 0;
  for (let i = 0; i < months; i++) {
    const j = i - 1;
    let sig = false;
    if (j >= 1) {
      if (engine === "orthrus") sig = price[j] > sma[j];
      else if (engine === "hydra") sig = price[j] > sma[j] && price[j] > price[Math.max(0, j - 3)];
      else sig = price[j] < sma[j] * 0.95;
    }
    const traded = sig !== prevIn;
    let r = sig ? bhSimple[i] : 0;
    if (traded) r -= feeSide;
    stratSimple.push(r);
    if (sig && !prevIn) entries++;
    if (sig) inMonths++;
    prevIn = sig;
  }

  const stratEq = toEquity(stratSimple);
  const bhEq = toEquity(bhSimple);
  const years = months / 12;
  const sFinal = stratEq[stratEq.length - 1];
  const bFinal = bhEq[bhEq.length - 1];
  const sAnn = annualized(stratSimple);
  const bAnn = annualized(bhSimple);
  const sCagr = (Math.pow(sFinal / 100, 1 / years) - 1) * 100;
  const sMaxDd = maxDrawdown(stratEq);

  const metrics: Metrics = {
    totalReturnPct: round1(sFinal - 100),
    cagrPct: round1(sCagr),
    maxDrawdownPct: round1(sMaxDd),
    volatilityPct: round1(sAnn.vol * 100),
    sharpe: round2(sAnn.sharpe),
    sortino: round2(sAnn.sortino),
    calmar: round2(Math.abs(sMaxDd) > 0.01 ? sCagr / Math.abs(sMaxDd) : 0),
    profitFactor: round2(profitFactor(stratSimple)),
    pctInMarket: round1((inMonths / months) * 100),
    trades: entries,
  };

  const benchmark: Benchmark = {
    totalReturnPct: round1(bFinal - 100),
    maxDrawdownPct: round1(maxDrawdown(bhEq)),
    sharpe: round2(bAnn.sharpe),
  };

  const curve: CurvePoint[] = [];
  for (let i = 0; i < months; i += 2) {
    curve.push({
      year: String(prof.start + Math.floor(i / 12)),
      strategy: Math.round(stratEq[i]),
      buyHold: Math.round(bhEq[i]),
    });
  }
  const lastIdx = months - 1;
  if ((months - 1) % 2 !== 0) {
    curve.push({
      year: String(prof.start + Math.floor(lastIdx / 12)),
      strategy: Math.round(stratEq[lastIdx]),
      buyHold: Math.round(bhEq[lastIdx]),
    });
  }

  return { metrics, benchmark, curve, startYear: prof.start, years };
}
