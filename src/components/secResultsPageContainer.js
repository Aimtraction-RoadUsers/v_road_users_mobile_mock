import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CMPResults } from "./cmpResults";
import { CMPResultFiltersSheet } from "./cmpResultFiltersSheet";
import { applyFilters, isFilterActive, countActiveFilters, defaultFilters, } from "../resultsFiltering";
import { mockCarpool, mockBuses, mockTrains, mockCarriers, } from "../mobility-mock";
import { computeCarrierCounts } from "../carrierCounts";
import { mockCarpoolDetail, mockBusDetail, mockTrainDetail, } from "./secDetailsPageContainer";
export function SECResultsPageContainer({ onBack }) {
    const topRef = useRef(null);
    const [sp] = useSearchParams();
    const navigate = useNavigate();
    const from = sp.get("from") ?? "";
    const to = sp.get("to") ?? "";
    const whenISO = sp.get("when") ?? undefined;
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);
    const active = isFilterActive(filters);
    const activeCount = countActiveFilters(filters);
    const resetAll = () => setFilters(defaultFilters);
    // 👇 стан деталки:
    const [detailMode, setDetailMode] = useState(null);
    const [detailOffer, setDetailOffer] = useState(undefined);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailEntryPoint, setDetailEntryPoint] = useState("card");
    // збережемо позицію скролу, щоб акуратно повертатись із details
    const scrollYRef = useRef(0);
    // 💡 Тут «сире» джерело (API в майбутньому), поки — моки
    const raw = {
        carpool: mockCarpool,
        buses: mockBuses,
        trains: mockTrains,
    };
    // 🧠 Застосовуємо фільтри та сортування на фронті
    const filtered = useMemo(() => applyFilters(filters, raw), [filters, raw]);
    // Лічильники по перевізниках (без carrier-фільтрів)
    const carrierCounts = useMemo(() => computeCarrierCounts(raw, filters), [raw, filters]);
    // Збагачені опції з лічильниками
    const carrierOptionsWithCounts = useMemo(() => mockCarriers.map((opt) => {
        const count = carrierCounts[opt.id] ?? 0;
        return { ...opt, count, disabled: count === 0 };
    }), [carrierCounts]);
    const onApplyFilters = (next) => {
        setFilters(next);
        setFiltersOpen(false);
        // 🔽 дочекатись закриття шита й прокрутити
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            // або: window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };
    const onSortChange = (key) => {
        setFilters((f) => ({ ...f, sort: key }));
        // (опційно) скрол догори і при сортуванні:
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };
    // 🔑 ВАЖЛИВО: визначаємо onOpenDetail тут
    const onOpenDetail = (mode, id, entryPoint) => {
        const qs = new URLSearchParams({
            entry: entryPoint,
            from,
            to,
            when: whenISO ?? "",
        });
        navigate(`/mobility/carpool/detail/${mode}/${id}?${qs.toString()}`);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: topRef }), _jsx(CMPResults, { modeLabel: "\u041F\u0456\u0434\u0441\u0430\u0434\u043A\u0430 / \u0410\u0432\u0442\u043E\u0431\u0443\u0441 / \u0417\u0430\u043B\u0456\u0437\u043D\u0438\u0446\u044F", from: from, to: to, whenISO: whenISO, carpool: filtered.carpool, buses: filtered.buses, trains: filtered.trains, onOpenFilters: () => setFiltersOpen(true), onSortChange: onSortChange, 
                // 🔹 прокидаємо фільтри ДО cmpResults
                filters: filters, onFiltersChange: setFilters, onBack: onBack, filtersActive: active, filtersActiveCount: activeCount, onClearAllFilters: resetAll, onOpenDetail: onOpenDetail }), _jsx(CMPResultFiltersSheet, { open: filtersOpen, onClose: () => setFiltersOpen(false), value: filters, onApply: onApplyFilters, carrierOptions: mockCarriers })] }));
}
// ================== Моки detail за id ==================
function getMockDetailById(mode, id) {
    if (mode === "carpool") {
        // спробуємо знайти чимось схожим у списку і зібрати detail
        // тут для демо — просто віддаємо заготовку
        return { ...mockCarpoolDetail, id };
    }
    if (mode === "bus") {
        return { ...mockBusDetail, id };
    }
    return { ...mockTrainDetail, id };
}
