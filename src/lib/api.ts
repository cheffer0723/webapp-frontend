import { forecastRegimes, type RegimeForecast, type UploadResult } from "@/lib/emotion-data";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

interface EmotionUploadResponse {
  success: boolean;
  trades_processed: number;
  summary: {
    total_emotional_cost: number;
    system_edge: number;
  };
}

interface ApiAssetForecast {
  orthrus: { signal: "IN" | "OUT" | "UNKNOWN"; confidence: number };
  hydra: { signal: "IN" | "OUT" | "UNKNOWN"; confidence: number };
  sisyphus: { signal: "IN" | "OUT" | "UNKNOWN"; confidence: number };
  forecast_7day: string;
  probability: number;
}

interface ApiRegimeForecast {
  SPY: ApiAssetForecast;
  QQQ: ApiAssetForecast;
  BTC: ApiAssetForecast;
}

export async function uploadEmotionCsv(csv: string): Promise<UploadResult> {
  const response = await fetch(`${API_BASE_URL}/emotional-decisions/upload`, {
    method: "POST",
    headers: {
      "content-type": "text/csv",
      "x-user-id": getClientUserId(),
    },
    body: csv,
  });

  const payload = (await response.json().catch(() => null)) as EmotionUploadResponse | { error?: string } | null;
  if (!response.ok || !payload || !("summary" in payload)) {
    throw new Error(payload && "error" in payload && payload.error ? payload.error : "Upload failed.");
  }

  const emotionalCost = Math.round(payload.summary.total_emotional_cost);
  const systemGain = Math.round(payload.summary.system_edge);
  return {
    trades: payload.trades_processed,
    emotionalCost,
    systemGain,
    totalGap: systemGain - emotionalCost,
  };
}

export async function fetchRegimeForecast(): Promise<RegimeForecast[]> {
  const response = await fetch(`${API_BASE_URL}/regime-forecast`);
  const payload = (await response.json().catch(() => null)) as ApiRegimeForecast | null;
  if (!response.ok || !payload) {
    throw new Error("Forecast unavailable.");
  }

  return ["SPY", "QQQ", "BTC"].map((symbol) => {
    const key = symbol as keyof ApiRegimeForecast;
    const item = payload[key];
    const primary = item.orthrus.signal !== "UNKNOWN" ? item.orthrus : item.sisyphus;
    const inMarket = primary.signal === "IN";

    return {
      symbol,
      market: symbol === "SPY" ? "S&P 500" : symbol === "QQQ" ? "Nasdaq 100" : "Bitcoin",
      engine: "Orthrus",
      status: inMarket ? "IN" : "OUT",
      signal: inMarket ? "Regime confirms risk-on" : "Regime confirms risk-off",
      confidence: Math.round(primary.confidence * 100),
      probability: Math.round(item.probability * 100),
      outlook: item.forecast_7day,
      action: inMarket ? `HOLD on ${symbol}, don't panic on dips` : `STAY OUT of ${symbol} until confirmation improves`,
    };
  });
}

export function getForecastFallback(): RegimeForecast[] {
  return forecastRegimes;
}

function getClientUserId(): string {
  const key = "obsidian_emotion_demo_user_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const value = `demo-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, value);
  return value;
}
