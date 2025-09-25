import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ViewId =
  | "Home"
  | "Mobility"
  | "Care"
  | "Docs"
  | "City"
  | "MobilityLive"   // приклад повноекранного режиму
  | "SearchResults";

type NavState = {
  view: ViewId;
  params?: Record<string, any>;
  hideTopBar: boolean;
  setHideTopBar: (v: boolean) => void;
  navigateToPage: (action: string, params?: Record<string, any>) => void;
};

const NavCtx = createContext<NavState | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewId>("Home");
  const [params, setParams] = useState<Record<string, any> | undefined>();
  const [hideTopBar, setHideTopBar] = useState(false);

  // Мапа твоїх ACTION_ROUTES → ViewId
  const ACTION_MAP: Record<string, ViewId> = useMemo(() => ({
    goTaxiPage: "Mobility",
    bookCarpool: "Mobility",
    openCareNearMe: "Care",
    buyInsurance: "Docs",
    payFine: "Docs",
    openSearchResults: "SearchResults",
    openMobilityLive: "MobilityLive",
  }), []);

  const navigateToPage = useCallback((action: string, p?: Record<string, any>) => {
    const nextView = ACTION_MAP[action] ?? "Home";
    setParams(p);
    setView(nextView);
    // за замовчуванням TopBar показаний, а окремі екрани самі можуть його сховати через setHideTopBar(true)
    setHideTopBar(nextView === "MobilityLive"); 
  }, [ACTION_MAP]);

  return (
    <NavCtx.Provider value={{ view, params, hideTopBar, setHideTopBar, navigateToPage }}>
      {children}
    </NavCtx.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error("useNav must be used inside <NavProvider>");
  return ctx;
}
