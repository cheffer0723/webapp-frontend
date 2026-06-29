import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function App() {
  const [status, setStatus] = React.useState<string>("not checked");

  async function checkBackend() {
    setStatus("checking...");
    try {
      const response = await fetch(`${API_BASE}/api/healthz`);
      const body = await response.json();
      setStatus(body.status || "ok");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "backend check failed");
    }
  }

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Clean split baseline</p>
        <h1>Frontend is live.</h1>
        <p>
          This repository is the static frontend only. It is separate from the Railway backend API.
        </p>
        <button type="button" onClick={checkBackend}>Check backend</button>
        <p className="status">Backend status: {status}</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
