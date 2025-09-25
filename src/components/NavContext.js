import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
const NavCtx = createContext(null);
export function NavProvider({ children }) {
    const [view, setView] = useState("Home");
    const [params, setParams] = useState();
    const [hideTopBar, setHideTopBar] = useState(false);
    // Мапа твоїх ACTION_ROUTES → ViewId
    const ACTION_MAP = useMemo(() => ({
        goTaxiPage: "Mobility",
        bookCarpool: "Mobility",
        openCareNearMe: "Care",
        buyInsurance: "Docs",
        payFine: "Docs",
        openSearchResults: "SearchResults",
        openMobilityLive: "MobilityLive",
    }), []);
    const navigateToPage = useCallback((action, p) => {
        const nextView = ACTION_MAP[action] ?? "Home";
        setParams(p);
        setView(nextView);
        // за замовчуванням TopBar показаний, а окремі екрани самі можуть його сховати через setHideTopBar(true)
        setHideTopBar(nextView === "MobilityLive");
    }, [ACTION_MAP]);
    return (_jsx(NavCtx.Provider, { value: { view, params, hideTopBar, setHideTopBar, navigateToPage }, children: children }));
}
export function useNav() {
    const ctx = useContext(NavCtx);
    if (!ctx)
        throw new Error("useNav must be used inside <NavProvider>");
    return ctx;
}
