import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/home";
import { Chrome } from "@/components/layout/chrome";
import { IntroReveal } from "@/components/ui/intro-reveal";
import { AbyssAtmosphere } from "@/components/effects/abyss-atmosphere";
import { DemoAccessProvider } from "@/context/demo-access-context";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoAccessProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <IntroReveal />
            <AbyssAtmosphere />
            <Chrome />
            <Router />
          </WouterRouter>
          <Toaster />
        </DemoAccessProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
