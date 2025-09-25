// nav/useNavigateAction.ts
import { useNavigate } from "react-router-dom";

export function useNavigateAction() {
  const navigate = useNavigate();

  const ACTION_ROUTES: Record<string,(p?:any)=>string> = {
    goTaxiPage: () => "/mobility",
    bookCarpool: (p) => `/mobility?from=${p?.from||""}&to=${p?.to||""}&when=${p?.whenISO||""}`,
    openCareNearMe: () => "/care",
    buyInsurance: (p) => `/docs${p?.vehicleId?`?vehicle=${p.vehicleId}`:""}`,
    payFine: () => "/docs?tab=fines",
    openSearchResults: () => "/search",
    openMobilityLive: () => "/mobility/live",
  };

  function navigateToPage(action: string, params?: Record<string, any>) {
    const to = ACTION_ROUTES[action]?.(params) ?? "/";
    navigate(to);
  }

  return { navigateToPage };
}
