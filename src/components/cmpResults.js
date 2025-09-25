import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/cmpResults.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, Filter, ChevronDown, Car, Bus, Train, User, Clock, Wallet, Users, Ticket, CalendarClock, Info, } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { isFilterActive, countActiveFilters, defaultFilters, } from "../resultsFiltering";
import { CMPActiveFiltersBar } from "./cmpActiveFiltersBar";
/* ===================== Helpers ===================== */
function formatUAH(n) {
    try {
        return new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
        }).format(n);
    }
    catch {
        return `${n} грн`;
    }
}
/* ================= Skeletons (animate-pulse) ================= */
function SkeletonLine({ className = "" }) {
    return (_jsx("div", { className: `h-3 w-full rounded bg-muted animate-pulse ${className}` }));
}
function SkeletonButton() {
    return _jsx("div", { className: "h-9 w-28 rounded-xl bg-muted animate-pulse" });
}
function CardSkeleton() {
    return (_jsx("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-6 w-6 rounded bg-muted animate-pulse" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(SkeletonLine, { className: "w-2/5" }), _jsx(SkeletonLine, { className: "w-3/5" }), _jsxs("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [_jsx(SkeletonLine, {}), _jsx(SkeletonLine, {}), _jsx(SkeletonLine, {})] })] }), _jsx(SkeletonButton, {})] }) }));
}
/* ===================== Empty blocks ===================== */
function EmptyBlock({ icon, title, message, showFilterHint = false, }) {
    const Icon = icon;
    return (_jsxs("div", { className: "rounded-xl border border-dashed p-6 text-center", children: [_jsx("div", { className: "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent", children: _jsx(Icon, { className: "h-5 w-5 text-accent-foreground" }) }), _jsx("div", { className: "text-sm font-semibold", children: title }), _jsx("div", { className: "text-sm text-muted-foreground", children: message }), showFilterHint && (_jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: "\u0417\u043C\u0456\u043D\u0456\u0442\u044C \u0434\u0430\u0442\u0443 \u0442\u0430/\u0430\u0431\u043E \u0441\u043A\u0438\u043D\u044C\u0442\u0435 \u0444\u0456\u043B\u044C\u0442\u0440\u0438" }))] }));
}
/* ===================== Block headers ===================== */
function BlockHeader({ icon: Icon, title, }) {
    return (_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("h3", { className: "text-base font-semibold", children: title })] }));
}
/* ===================== Cards ===================== */
function CarpoolCard({ offer, onClick, }) {
    return (_jsx("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: _jsx(Car, { className: "h-6 w-6 text-foreground/80" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0412\u043E\u0434\u0456\u0439: ", offer.driverName] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Car, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0410\u0432\u0442\u043E: ", offer.carModel] })] })] }), _jsxs("div", { className: "mt-1 grid grid-cols-3 gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0427\u0430\u0441: ", offer.time] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Wallet, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0426\u0456\u043D\u0430: ", formatUAH(offer.priceUAH)] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u041C\u0456\u0441\u0446\u044C: ", offer.seatsLeft] })] })] })] }), _jsx("button", { onClick: onClick, className: "h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95", children: "\u0417\u0430\u0431\u0440\u043E\u043D\u044E\u0432\u0430\u0442\u0438" })] }) }));
}
function BusCard({ offer, onClick, }) {
    return (_jsx("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: _jsx(Bus, { className: "h-6 w-6 text-foreground/80" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: offer.routeTitle }), _jsxs("div", { className: "mt-1 grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(CalendarClock, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0412\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F: ", offer.departTime] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Ticket, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0426\u0456\u043D\u0430: ", formatUAH(offer.priceUAH)] })] })] })] }), _jsx("button", { onClick: onClick, className: "h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95", children: "\u041A\u0443\u043F\u0438\u0442\u0438 \u043A\u0432\u0438\u0442\u043E\u043A" })] }) }));
}
function TrainCard({ offer, onClick, }) {
    return (_jsx("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: _jsx(Train, { className: "h-6 w-6 text-foreground/80" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: offer.trainTitle }), _jsxs("div", { className: "mt-1 grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(CalendarClock, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0412\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F: ", offer.departTime] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Ticket, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u0426\u0456\u043D\u0430: ", formatUAH(offer.priceUAH)] })] })] })] }), _jsx("button", { onClick: onClick, className: "h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95", children: "\u041A\u0443\u043F\u0438\u0442\u0438 \u043A\u0432\u0438\u0442\u043E\u043A" })] }) }));
}
/* ===================== Main ===================== */
export function CMPResults({ modeLabel = "Підсадка / Автобус / Залізниця", from, to, whenISO, carpool, buses, trains, loadingCarpool = false, loadingBuses = false, loadingTrains = false, onBack, onOpenFilters, onSortChange, onBookCarpool, onBuyBus, onBuyTrain, filtersActive, filtersActiveCount, onClearAllFilters, 
// 🔹 нові пропси
filters: filtersProp, onFiltersChange, onOpenDetail, }) {
    const filters = filtersProp ?? defaultFilters;
    const { t } = useI18n();
    const [sortKey, setSortKey] = useState("time-asc");
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef(null);
    // Закривати по кліку поза меню
    useEffect(() => {
        if (!sortOpen)
            return;
        const onDocClick = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [sortOpen]);
    const handleSort = (key) => {
        setSortKey(key);
        onSortChange?.(key);
        setSortOpen(false); // 🔑 закриваємо після вибору
    };
    const subtitle = useMemo(() => {
        const parts = [];
        if (from)
            parts.push(from);
        if (to)
            parts.push("→ " + to);
        return parts.join(" ");
    }, [from, to]);
    // ...всередині компонента:
    const active = isFilterActive(filters);
    const activeCount = countActiveFilters(filters);
    return (_jsxs("div", { className: "mx-auto max-w-2xl px-4 py-3 space-y-6", children: [_jsx("header", { className: "sticky top-0 z-30 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2", children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("button", { onClick: onBack, className: "inline-flex items-center gap-2 text-sm hover:opacity-80", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), _jsx("span", { children: t("back") ?? "Назад" })] }), _jsxs("div", { className: "min-w-0 flex-1 px-2 text-center", children: [_jsxs("div", { className: "truncate text-sm font-semibold", children: [t("travel.mode") ?? "Спосіб доїзду", ": ", modeLabel] }), subtitle && (_jsx("div", { className: "truncate text-xs text-muted-foreground", children: subtitle })), whenISO && (_jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: new Date(whenISO).toLocaleString("uk-UA") }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [filtersActive && (_jsx("button", { onClick: onClearAllFilters, className: "hidden sm:inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-accent", title: "\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u0432\u0441\u0456 \u0444\u0456\u043B\u044C\u0442\u0440\u0438", children: "\u0421\u043A\u0438\u043D\u0443\u0442\u0438" })), _jsx("div", { className: "relative", children: _jsxs("button", { onClick: onOpenFilters, className: "relative inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent", children: [_jsx(Filter, { className: "h-4 w-4" }), _jsx("span", { children: t("filters") ?? "Фільтри" }), filtersActive && (_jsx("span", { className: "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground", children: Math.min(filtersActiveCount ?? 1, 9) }))] }) }), _jsxs("div", { className: "relative", ref: sortRef, children: [_jsxs("button", { onClick: () => setSortOpen((v) => !v), className: "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-accent", "aria-expanded": sortOpen ? "true" : "false", "aria-haspopup": "menu", children: [_jsx("span", { children: t("sort") ?? "Сортування" }), _jsx(ChevronDown, { className: `h-4 w-4 transition ${sortOpen ? "rotate-180" : ""}` })] }), sortOpen && (_jsx("div", { role: "menu", className: "absolute right-0 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-sm", children: [
                                                { key: "time-asc", label: "Час ↑" },
                                                { key: "time-desc", label: "Час ↓" },
                                                { key: "price-asc", label: "Ціна ↑" },
                                                { key: "price-desc", label: "Ціна ↓" },
                                            ].map((opt) => (_jsx("button", { role: "menuitem", onClick: () => handleSort(opt.key), className: `w-full rounded px-2 py-1 text-left text-sm hover:bg-accent ${sortKey === opt.key ? "font-semibold" : ""}`, children: opt.label }, opt.key))) }))] })] })] }) }), onFiltersChange && (_jsx("div", { className: "-mx-4 border-b bg-background/80 backdrop-blur px-4", children: _jsx("div", { className: "mx-auto max-w-2xl py-2", children: _jsx(CMPActiveFiltersBar, { filters: filters, onChange: onFiltersChange }) }) })), _jsxs("section", { className: "space-y-3", children: [_jsx(BlockHeader, { icon: Car, title: `🚗 Підсадка (${carpool.length})` }), loadingCarpool ? (_jsxs(_Fragment, { children: [_jsx(CardSkeleton, {}), _jsx(CardSkeleton, {})] })) : carpool.length ? (carpool.map((o) => (_jsx("article", { className: "rounded-xl border p-3 hover:bg-accent cursor-pointer", onClick: () => onOpenDetail?.("carpool", o.id, "card"), children: _jsx(CarpoolCard, { offer: o, onClick: (e) => {
                                e.stopPropagation(); // щоб не спрацював tap по карточці
                                onOpenDetail?.("carpool", o.id, "primaryCta"); // 👈 натискання primary CTA
                            } }, o.id) }, o.id)))) : (_jsx(EmptyBlock, { icon: Car, title: "\u041F\u0456\u0434\u0441\u0430\u0434\u043A\u0430", message: "\u041D\u0435\u043C\u0430\u0454 \u043F\u0440\u043E\u043F\u043E\u0437\u0438\u0446\u0456\u0439 \u043D\u0430 \u0446\u044E \u0434\u0430\u0442\u0443/\u043C\u0430\u0440\u0448\u0440\u0443\u0442", showFilterHint: !!filtersActive }))] }), _jsxs("section", { className: "space-y-3", children: [_jsx(BlockHeader, { icon: Bus, title: `🚌 Автобуси (${buses.length})` }), loadingBuses ? (_jsxs(_Fragment, { children: [_jsx(CardSkeleton, {}), _jsx(CardSkeleton, {})] })) : buses.length ? (buses.map((o) => (_jsx("article", { className: "rounded-xl border p-3 hover:bg-accent cursor-pointer", onClick: () => onOpenDetail?.("bus", o.id, "card"), children: _jsx(BusCard, { offer: o, onClick: (e) => {
                                e.stopPropagation();
                                onOpenDetail?.("bus", o.id, "primaryCta");
                            } }, o.id) }, o.id)))) : (_jsx(EmptyBlock, { icon: Bus, title: "\u0410\u0432\u0442\u043E\u0431\u0443\u0441\u0438", message: "\u041D\u0435\u043C\u0430\u0454 \u0440\u0435\u0439\u0441\u0456\u0432 \u043D\u0430 \u0446\u044E \u0434\u0430\u0442\u0443", showFilterHint: !!filtersActive }))] }), _jsxs("section", { className: "space-y-3", children: [_jsx(BlockHeader, { icon: Train, title: `🚆 Залізниця (${trains.length})` }), loadingTrains ? (_jsx(_Fragment, { children: _jsx(CardSkeleton, {}) })) : trains.length ? (trains.map((o) => (_jsx("article", { className: "rounded-xl border p-3 hover:bg-accent cursor-pointer", onClick: () => onOpenDetail?.("train", o.id, "card"), children: _jsx(TrainCard, { offer: o, onClick: (e) => {
                                e.stopPropagation();
                                onOpenDetail?.("train", o.id, "primaryCta");
                            } }, o.id) }, o.id)))) : (_jsx(EmptyBlock, { icon: Train, title: "\u0417\u0430\u043B\u0456\u0437\u043D\u0438\u0446\u044F", message: "\u041D\u0435\u043C\u0430\u0454 \u0440\u0435\u0439\u0441\u0456\u0432 \u043D\u0430 \u0446\u044E \u0434\u0430\u0442\u0443", showFilterHint: !!filtersActive }))] }), _jsx("div", { className: "rounded-xl border bg-card p-3 text-sm text-muted-foreground", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Info, { className: "mt-0.5 h-4 w-4" }), _jsx("p", { children: "\u041F\u043E\u0440\u0430\u0434\u0430: \u0437\u043C\u0456\u043D\u0456\u0442\u044C \u0447\u0430\u0441 \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u0430\u0431\u043E \u0441\u0443\u0441\u0456\u0434\u043D\u0456\u0439 \u0440\u0430\u0439\u043E\u043D \u2014 \u0448\u0430\u043D\u0441\u0438 \u0437\u043D\u0430\u0439\u0442\u0438 \u0432\u0430\u0440\u0456\u0430\u043D\u0442 \u0437\u0440\u043E\u0441\u0442\u0443\u0442\u044C." })] }) })] }));
}
export default CMPResults;
