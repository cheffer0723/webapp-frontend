import { Hero } from "@/components/sections/hero";
import { EmotionProof } from "@/components/sections/emotion-proof";
import { EmotionTradeBreakdown } from "@/components/sections/emotion-trade-breakdown";
import { EmotionMetrics } from "@/components/sections/emotion-metrics";
import { EmotionForecast } from "@/components/sections/emotion-forecast";
import { EmotionUpload } from "@/components/sections/emotion-upload";
import { LiveEngine } from "@/components/sections/live-engine";
import { Backtest } from "@/components/sections/backtest";
import { PlatformCards } from "@/components/sections/platform-cards";
import { Modules } from "@/components/sections/modules";
import { Stats } from "@/components/sections/stats";
import { MiroFish } from "@/components/sections/mirofish";
import { Agents } from "@/components/sections/agents";
import { Pricing } from "@/components/sections/pricing";
import { Footer } from "@/components/sections/footer";

export function Home() {
  return (
    <main className="bg-[#010309] min-h-screen text-white">
      <Hero />
      <EmotionProof />
      <EmotionTradeBreakdown />
      <EmotionMetrics />
      <EmotionForecast />
      <EmotionUpload />
      <LiveEngine />
      <Backtest />
      <PlatformCards />
      <Modules />
      <Stats />
      <MiroFish />
      <Agents />
      <Pricing />
      <Footer />
    </main>
  );
}
