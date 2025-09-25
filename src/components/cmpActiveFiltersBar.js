import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ActiveFiltersBar.tsx
import { X } from "lucide-react";
import { defaultFilters, } from "../resultsFiltering";
function Chip({ children, onRemove, disabled, title, }) {
    return (_jsxs("span", { title: title, className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${disabled ? "opacity-50" : "hover:bg-accent"}`, children: [children, !disabled && (_jsx("button", { "aria-label": "Remove filter", className: "p-0.5 rounded hover:bg-muted", onClick: onRemove, children: _jsx(X, { className: "h-3.5 w-3.5" }) }))] }));
}
export function CMPActiveFiltersBar({ filters, onChange, }) {
    const f = filters ?? defaultFilters;
    const chips = [];
    // Ціна
    if (filters.priceMin != null || filters.priceMax != null) {
        const text = filters.priceMin != null && filters.priceMax != null
            ? `Ціна ${filters.priceMin}–${filters.priceMax} грн`
            : filters.priceMin != null
                ? `Ціна від ${filters.priceMin} грн`
                : `Ціна до ${filters.priceMax} грн`;
        chips.push(_jsx(Chip, { onRemove: () => onChange({
                ...filters,
                priceMin: undefined,
                priceMax: undefined,
            }), children: text }, "price"));
    }
    // Час
    if (filters.departFrom || filters.departTo) {
        const tf = filters.departFrom ?? "00:00";
        const tt = filters.departTo ?? "23:59";
        chips.push(_jsxs(Chip, { onRemove: () => onChange({
                ...filters,
                departFrom: undefined,
                departTo: undefined,
            }), children: ["\u0427\u0430\u0441 ", tf, "\u2013", tt] }, "time"));
    }
    // Місця (carpool)
    if (filters.minSeats != null) {
        chips.push(_jsxs(Chip, { onRemove: () => onChange({ ...filters, minSeats: undefined }), children: ["\u041C\u0456\u0441\u0446\u044C \u0432\u0456\u0434 ", filters.minSeats] }, "seats"));
    }
    // Верифіковані
    if (filters.onlyVerified) {
        chips.push(_jsx(Chip, { onRemove: () => onChange({ ...filters, onlyVerified: false }), children: "\u041B\u0438\u0448\u0435 \u0432\u0435\u0440\u0438\u0444\u0456\u043A\u043E\u0432\u0430\u043D\u0456" }, "verified"));
    }
    // Миттєве бронювання
    if (filters.onlyInstantBooking) {
        chips.push(_jsx(Chip, { onRemove: () => onChange({ ...filters, onlyInstantBooking: false }), children: "\u041C\u0438\u0442\u0442\u0454\u0432\u0435 \u0431\u0440\u043E\u043D\u044E\u0432\u0430\u043D\u043D\u044F" }, "instant"));
    }
    // Режими (показуємо, якщо вимкнули НЕ всі)
    if (filters.modes &&
        !(filters.modes.carpool &&
            filters.modes.bus &&
            filters.modes.train)) {
        const onRemoveMode = () => onChange({
            ...filters,
            modes: { carpool: true, bus: true, train: true },
        });
        const parts = Object.entries(filters.modes)
            .filter(([, v]) => v)
            .map(([k]) => k === "carpool"
            ? "Підсадка"
            : k === "bus"
                ? "Автобуси"
                : "Залізниця")
            .join(", ");
        chips.push(_jsxs(Chip, { onRemove: onRemoveMode, children: ["\u0420\u0435\u0436\u0438\u043C\u0438: ", parts || "нема"] }, "modes"));
    }
    // Перевізники (IDs або names)
    const carriersCount = (filters.carriers?.length ?? 0) +
        (filters.carrierNames?.length ?? 0);
    if (carriersCount > 0) {
        chips.push(_jsxs(Chip, { onRemove: () => onChange({
                ...filters,
                carriers: [],
                carrierNames: [],
            }), children: ["\u041F\u0435\u0440\u0435\u0432\u0456\u0437\u043D\u0438\u043A\u0438: ", carriersCount] }, "carriers"));
    }
    // Сортування (можна відобразити, але без хрестика)
    // якщо не хочеш показувати — забери блок
    if (filters.sort && filters.sort !== "time-asc") {
        const map = {
            "time-asc": "Час ↑",
            "time-desc": "Час ↓",
            "price-asc": "Ціна ↑",
            "price-desc": "Ціна ↓",
        };
        chips.push(_jsxs(Chip, { onRemove: () => onChange({ ...filters, sort: "time-asc" }), children: ["\u0421\u043E\u0440\u0442\u0443\u0432\u0430\u043D\u043D\u044F: ", map[filters.sort]] }, "sort"));
    }
    if (chips.length === 0)
        return null;
    return (_jsx("div", { className: "px-4 -mx-4 border-b bg-background/80 backdrop-blur", children: _jsx("div", { className: "mx-auto max-w-2xl py-2", children: _jsx("div", { className: "flex flex-wrap gap-2", children: chips }) }) }));
}
