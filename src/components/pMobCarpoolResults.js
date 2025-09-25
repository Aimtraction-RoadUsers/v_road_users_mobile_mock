import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/mobility/pMobilityResults.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams, } from "react-router-dom";
import { CMPResults } from "./cmpResults";
import { applyFilters, defaultFilters, } from "../resultsFiltering";
import { mockCarpool, mockBuses, mockTrains, mockCarriers, } from "../mobility-mock";
import { CMPResultFiltersSheet } from "./cmpResultFiltersSheet";
export default function PMobCarpoolResults() {
    const [filters, setFilters] = useState(defaultFilters);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sp] = useSearchParams();
    const location = useLocation(); // ✅ маємо location тут
    const navigate = useNavigate();
    const from = sp.get("from") ?? "";
    const to = sp.get("to") ?? "";
    const whenISO = sp.get("when") ?? undefined;
    const raw = {
        carpool: mockCarpool,
        buses: mockBuses,
        trains: mockTrains,
    };
    const filtered = useMemo(() => applyFilters(filters, raw), [filters, raw]);
    // ⬇️ головний колбек
    const onOpenDetail = (mode, id, entryPoint) => {
        // ✅ backTo ОГОЛОШЕНО ТУТ (у тому ж скоупі, де navigate)
        const backTo = (location.pathname ?? "") + (location.search ?? "");
        const qs = new URLSearchParams({
            entry: entryPoint,
            from,
            to,
            when: whenISO ?? "",
        });
        navigate(`/mobility/detail/${mode}/${id}?${qs.toString()}`, {
            state: { backTo }, // 👈 кладемо звідки прийшли
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(CMPResults, { from: from, to: to, whenISO: whenISO, carpool: filtered.carpool, buses: filtered.buses, trains: filtered.trains, onBack: () => navigate(-1), onOpenFilters: () => setFiltersOpen(true), onSortChange: (key) => setFilters((f) => ({ ...f, sort: key })), onOpenDetail: onOpenDetail, filters: filters, onFiltersChange: setFilters }), _jsx(CMPResultFiltersSheet, { open: filtersOpen, onClose: () => setFiltersOpen(false), value: filters, onApply: (next) => {
                    setFilters(next);
                    setFiltersOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }, carrierOptions: mockCarriers })] }));
}
