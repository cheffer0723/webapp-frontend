import { useCallback, useRef, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { DecodeText } from "../ui/decode-text";
import { scrollToSection } from "@/lib/scroll-to";
import {
  csvExample,
  parseTradeCount,
  simulateUpload,
  fmtMoney,
  type UploadResult,
} from "@/lib/emotion-data";

type Status = "idle" | "processing" | "done" | "error";

function ResultStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "loss" | "gain" | "primary";
}) {
  const c = tone === "loss" ? "text-rose-400" : tone === "gain" ? "text-emerald-400" : "text-primary";
  return (
    <div className="bg-[#000206] p-5 text-center">
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/35 mb-2">
        {label}
      </div>
      <div className={`font-display font-bold text-2xl ${c}`}>{value}</div>
    </div>
  );
}

function Results({ result, onReset }: { result: UploadResult; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative border border-primary/30 bg-[#000206] p-6 md:p-8 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary/70 mb-1">
        Your upload results
      </div>
      <div className="font-display font-bold text-white text-2xl mb-6">
        {result.trades} trades analyzed
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/10 mb-6">
        <ResultStat label="Emotional trades cost you" value={fmtMoney(result.emotionalCost)} tone="loss" />
        <ResultStat label="System would have made" value={fmtMoney(result.systemGain)} tone="gain" />
        <ResultStat label="Total gap" value={`$${result.totalGap.toLocaleString()}`} tone="primary" />
      </div>

      <div className="text-center mb-6">
        <div className="font-display font-bold text-3xl md:text-4xl text-white">
          <span className="text-primary">${result.totalGap.toLocaleString()}</span> left on the table
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          data-testid="results-breakdown"
          onClick={() => scrollToSection("access")}
          className="flex-1 py-3.5 bg-primary text-[#010309] font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all"
        >
          See your full breakdown
        </button>
        <button
          type="button"
          data-testid="results-reset"
          onClick={onReset}
          className="flex-1 py-3.5 border border-white/15 text-white/70 font-mono text-xs tracking-[0.2em] uppercase hover:bg-white/[0.04] hover:text-white transition-all"
        >
          Upload more trades
        </button>
      </div>
      <p className="mt-4 text-center font-mono text-[9px] tracking-[0.15em] uppercase text-amber-400/70">
        Simulated estimate &middot; full per-trade breakdown after access
      </p>
    </motion.div>
  );
}

export function EmotionUpload() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileReady, setFileReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<string>("");

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file.");
      setStatus("error");
      setFileName(null);
      setFileReady(false);
      setResult(null);
      textRef.current = "";
      return;
    }
    setError(null);
    setStatus("idle");
    setFileName(file.name);
    setFileReady(false);
    setResult(null);
    textRef.current = "";
    const reader = new FileReader();
    reader.onload = () => {
      textRef.current = String(reader.result ?? "");
      setFileReady(true);
    };
    reader.onerror = () => {
      setError("Could not read that file. Try again.");
      setStatus("error");
      setFileName(null);
      setFileReady(false);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const submit = useCallback(() => {
    if (!fileName) {
      setError("Choose a CSV file first.");
      setStatus("error");
      return;
    }
    if (!fileReady) {
      setError("Still reading your file. Try again in a moment.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setError(null);
    window.setTimeout(() => {
      const count = parseTradeCount(textRef.current);
      if (count <= 0) {
        setError("No trades found in that file. Check the format below.");
        setStatus("error");
        return;
      }
      setResult(simulateUpload(count));
      setStatus("done");
    }, 1500);
  }, [fileName, fileReady]);

  const reset = useCallback(() => {
    setStatus("idle");
    setFileName(null);
    setFileReady(false);
    setResult(null);
    setError(null);
    textRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <section
      id="upload"
      className="scroll-mt-24 py-20 md:py-28 bg-[#010309] relative z-10 border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 max-w-2xl mx-auto text-center">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary/70 mb-4">
            // See Your Emotional Cost
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            <DecodeText text="STOP GUESSING. SEE IT IN NUMBERS." />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed">
            Upload your trade history. We will show you the dollar cost of every emotional exit.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {status === "done" && result ? (
            <Results result={result} onReset={reset} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7 }}
              className="relative border border-primary/20 bg-[#000206] p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <label
                tabIndex={0}
                role="button"
                aria-label="Select CSV file"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center gap-3 border border-dashed p-10 text-center cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 ${
                  dragging
                    ? "border-primary/60 bg-primary/[0.04]"
                    : "border-white/15 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  data-testid="csv-input"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                {fileName ? (
                  <>
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-mono text-sm text-white">{fileName}</span>
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                      Click to replace
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7 text-primary/70" />
                    <span className="text-white/70 text-sm">
                      Drag &amp; drop your trades CSV, or{" "}
                      <span className="text-primary">browse</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                      .csv &middot; processed in your browser
                    </span>
                  </>
                )}
              </label>

              {error && (
                <div className="mt-4 font-mono text-[11px] text-rose-400" role="alert">
                  {error}
                </div>
              )}

              <button
                type="button"
                data-testid="csv-submit"
                onClick={submit}
                disabled={status === "processing"}
                className="mt-6 w-full py-4 bg-primary text-[#010309] font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing your trades&hellip;
                  </>
                ) : (
                  "Show me my numbers"
                )}
              </button>
              <p className="mt-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
                No login required. See your results instantly.
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
                  Example format
                </div>
                <pre className="overflow-x-auto bg-[#010309] border border-white/10 p-4 font-mono text-[11px] text-white/60 leading-relaxed">
                  {csvExample}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
