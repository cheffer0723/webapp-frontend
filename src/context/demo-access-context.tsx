import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface DemoAccessValue {
  hasAccess: boolean;
  setHasAccess: (value: boolean) => void;
  toggle: () => void;
}

const DemoAccessContext = createContext<DemoAccessValue | null>(null);

// Lightweight stand-in for real member auth (beta-invite system lives in the
// backend). Drives the visitor-vs-member states of the forecast widget so both
// can be demoed this week.
export function DemoAccessProvider({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const toggle = useCallback(() => setHasAccess((v) => !v), []);

  return (
    <DemoAccessContext.Provider value={{ hasAccess, setHasAccess, toggle }}>
      {children}
    </DemoAccessContext.Provider>
  );
}

export function useDemoAccess(): DemoAccessValue {
  const ctx = useContext(DemoAccessContext);
  if (!ctx) {
    throw new Error("useDemoAccess must be used within a DemoAccessProvider");
  }
  return ctx;
}
