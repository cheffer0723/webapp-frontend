import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const BETA_REQUEST_EMAIL = "TODO"; // TODO: replace with the real beta intake email address.

const whatThisIs = [
  {
    title: "AI-assisted building",
    body: "Use modern AI tools to shape rough ideas into usable sites, apps, workflows, and systems.",
  },
  {
    title: "Practical workflows",
    body: "Focus on useful outputs: landing pages, automations, dashboards, community systems, and internal tools.",
  },
  {
    title: "Beta build lab",
    body: "Early members help test the process, find friction, and shape what Obsidian Abyss becomes.",
  },
];

const whoThisIsFor = [
  "People who have ideas but struggle turning them into working tools",
  "Builders who want to learn vibe coding and AI-assisted building",
  "Founders and creators prototyping side projects",
  "People who want to build useful automations or websites",
  "Anyone who wants a private, focused environment instead of noisy social media",
];

const betaExpectations = [
  "Early access experiments",
  "Rough but improving tools and processes",
  "Direct feedback loops",
  "Build-focused guidance",
  "No fake guru promises",
  "No guaranteed outcomes",
  "Practical progress over hype",
];

function App() {
  const [backendStatus, setBackendStatus] = React.useState<"not checked" | "ok" | "error">(
    "not checked",
  );
  const [isCheckingBackend, setIsCheckingBackend] = React.useState(false);

  async function checkBackend() {
    setIsCheckingBackend(true);
    try {
      const response = await fetch(`${API_BASE}/api/healthz`);
      const body: unknown = await response.json();
      const status = typeof body === "object" && body !== null && "status" in body ? (body as { status?: string }).status : undefined;

      if (!response.ok || status !== "ok") {
        setBackendStatus("error");
        return;
      }

      setBackendStatus("ok");
    } catch {
      setBackendStatus("error");
    } finally {
      setIsCheckingBackend(false);
    }
  }

  const betaRequestHref = `mailto:${BETA_REQUEST_EMAIL}?subject=${encodeURIComponent(
    "Obsidian Abyss Beta Access Request",
  )}&body=${encodeURIComponent("I am interested in joining the Obsidian Abyss private beta.")}`;

  return (
    <main className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="hero section">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Obsidian Abyss</span>
            <span className="pill pill-accent">Private Beta</span>
          </div>

          <h1>Build in the dark. Ship what survives.</h1>

          <p className="lede">
            Obsidian Abyss is a private beta workspace for turning raw ideas into practical AI-assisted apps, automations, workflows, and digital systems.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={betaRequestHref}>
              Request Beta Access
            </a>
            <a className="button button-secondary" href="#access">
              Private beta now opening
            </a>
          </div>

          <div className="hero-status">
            <span className="signal signal-live">Backend live</span>
            <span className="microcopy">Fast checks against the Railway API.</span>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Late-night build lab</p>
          <div className="panel-grid">
            <div>
              <span className="panel-kicker">Focus</span>
              <strong>Practical systems</strong>
            </div>
            <div>
              <span className="panel-kicker">Mode</span>
              <strong>Private beta</strong>
            </div>
            <div>
              <span className="panel-kicker">Tone</span>
              <strong>Serious, not hype</strong>
            </div>
            <div>
              <span className="panel-kicker">Signal</span>
              <strong>Live backend check</strong>
            </div>
          </div>
          <p className="panel-note">
            A small, focused environment for testing ideas before they become real products.
          </p>
        </aside>
      </header>

      <section className="section" id="what-this-is">
        <div className="section-heading">
          <span className="eyebrow">What this is</span>
          <h2>A build lab for useful work, not a glossy promise machine.</h2>
        </div>

        <div className="grid three">
          {whatThisIs.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Who this is for</span>
          <h2>Built for people who want momentum without the noise.</h2>
        </div>

        <div className="grid two audience-grid">
          {whoThisIsFor.map((item) => (
            <article className="list-card" key={item}>
              <span className="dot" aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">What beta members can expect</span>
          <h2>Access to the process while it is still being shaped.</h2>
        </div>

        <div className="expectation-card">
          <ul className="expectation-list">
            {betaExpectations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section access-section" id="access">
        <div className="section-heading">
          <span className="eyebrow">Access</span>
          <h2>Request beta access without pretending the intake system is finished.</h2>
        </div>

        <div className="access-card">
          <p className="access-copy">
            Beta request intake coming online soon.
          </p>
          <a className="button button-primary button-large" href={betaRequestHref}>
            Request Beta Access
          </a>
          <p className="access-note">
            This uses a mailto placeholder for now so the frontend stays safe and the backend split remains intact.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">System status</span>
          <h2>The backend check stays in place, just with less of a placeholder feel.</h2>
        </div>

        <div className="status-card">
          <div className="status-row">
            <span className="status-label">Frontend</span>
            <span className="status-value status-value-live">live</span>
          </div>

          <div className="status-row">
            <span className="status-label">Backend API</span>
            <button
              className="button button-ghost"
              type="button"
              onClick={checkBackend}
              disabled={isCheckingBackend}
            >
              {isCheckingBackend ? "Checking..." : "Check backend"}
            </button>
          </div>

          <div className="status-row">
            <span className="status-label">Result</span>
            <span className={`status-value status-value-${backendStatus.replace(" ", "-")}`}>
              {backendStatus}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
