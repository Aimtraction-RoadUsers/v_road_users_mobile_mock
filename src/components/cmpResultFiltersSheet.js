import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/cmpResultFiltersSheet.tsx
import { useEffect, useRef, useState } from "react";
import { X, Check, Clock, Wallet, Users, ShieldCheck, Zap, Car, Bus, Train, ChevronDown, RotateCcw, } from "lucide-react";
import { useI18n } from "../I18nProvider";
export function CMPResultFiltersSheet({ open, onClose, value, onApply, carrierOptions = [
    { id: "flix", label: "FlixBus" },
    { id: "gunsel", label: "Gunsel" },
    { id: "udz", label: "Укрзалізниця" },
], }) {
    const { t } = useI18n();
    const [draft, setDraft] = useState(value);
    const sheetRef = useRef(null);
    // keep local draft in sync when parent changes
    useEffect(() => setDraft(value), [value]);
    // close on ESC
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    const toggleMode = (k) => setDraft((d) => ({
        ...d,
        modes: {
            ...(d.modes ?? {
                carpool: true,
                bus: true,
                train: true,
            }),
            [k]: !(d.modes ?? {})[k],
        },
    }));
    const toggleCarrier = (id) => setDraft((d) => {
        const set = new Set(d.carriers ?? []);
        set.has(id) ? set.delete(id) : set.add(id);
        return { ...d, carriers: Array.from(set) };
    });
    const reset = () => setDraft({
        priceMin: undefined,
        priceMax: undefined,
        departFrom: undefined,
        departTo: undefined,
        minSeats: undefined,
        onlyVerified: false,
        onlyInstantBooking: false,
        modes: { carpool: true, bus: true, train: true },
        carriers: [],
        sort: "time-asc",
    });
    const apply = () => {
        onApply(draft);
        onClose();
    };
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { ref: sheetRef, className: "absolute inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-2xl bg-card text-card-foreground shadow-xl", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted" }), _jsxs("div", { className: "flex items-start justify-between px-4 py-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: t("filters") ?? "Фільтри" }), _jsx("p", { className: "text-xs text-muted-foreground", children: t("filters.desc") ??
                                            "Задайте параметри для точнішого підбору" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: reset, className: "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-accent", "aria-label": "Reset filters", children: [_jsx(RotateCcw, { className: "h-4 w-4" }), t("reset") ?? "Скинути"] }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "rounded-lg p-2 hover:bg-accent", children: _jsx(X, { className: "h-5 w-5" }) })] })] }), _jsxs("div", { className: "grid max-h-[62vh] gap-4 overflow-y-auto px-4 pb-24", children: [_jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Car, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("filters.modes") ?? "Режими" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [_jsx(TogglePill, { active: draft.modes?.carpool ?? true, onClick: () => toggleMode("carpool"), icon: Car, label: t("mode.share") ?? "Підсадка" }), _jsx(TogglePill, { active: draft.modes?.bus ?? true, onClick: () => toggleMode("bus"), icon: Bus, label: t("bus") ?? "Автобуси" }), _jsx(TogglePill, { active: draft.modes?.train ?? true, onClick: () => toggleMode("train"), icon: Train, label: t("train") ?? "Залізниця" })] })] }), _jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("filters.time") ?? "Час відправлення" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(LabeledInput, { label: t("from") ?? "Від", type: "time", value: draft.departFrom ?? "", onChange: (v) => setDraft((d) => ({ ...d, departFrom: v })) }), _jsx(LabeledInput, { label: t("to") ?? "До", type: "time", value: draft.departTo ?? "", onChange: (v) => setDraft((d) => ({ ...d, departTo: v })) })] })] }), _jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Wallet, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("filters.price") ?? "Ціна (грн)" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(LabeledInput, { label: t("min") ?? "Від", type: "number", inputMode: "numeric", min: 0, value: draft.priceMin?.toString() ?? "", onChange: (v) => setDraft((d) => ({
                                                    ...d,
                                                    priceMin: v ? Number(v) : undefined,
                                                })) }), _jsx(LabeledInput, { label: t("max") ?? "До", type: "number", inputMode: "numeric", min: 0, value: draft.priceMax?.toString() ?? "", onChange: (v) => setDraft((d) => ({
                                                    ...d,
                                                    priceMax: v ? Number(v) : undefined,
                                                })) })] })] }), _jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("filters.carpool") ?? "Підсадка — параметри" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsx(LabeledInput, { label: t("filters.minSeats") ?? "Місць від", type: "number", inputMode: "numeric", min: 1, value: draft.minSeats?.toString() ?? "", onChange: (v) => setDraft((d) => ({
                                                    ...d,
                                                    minSeats: v ? Number(v) : undefined,
                                                })) }), _jsx(CheckRow, { icon: ShieldCheck, label: t("filters.onlyVerified") ??
                                                    "Лише верифіковані", checked: !!draft.onlyVerified, onChange: (checked) => setDraft((d) => ({
                                                    ...d,
                                                    onlyVerified: checked,
                                                })) }), _jsx(CheckRow, { icon: Zap, label: t("filters.instant") ?? "Миттєве бронювання", checked: !!draft.onlyInstantBooking, onChange: (checked) => setDraft((d) => ({
                                                    ...d,
                                                    onlyInstantBooking: checked,
                                                })) })] })] }), _jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Bus, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("filters.carriers") ?? "Перевізники" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: carrierOptions.map((c) => {
                                            const selected = draft.carriers?.includes(c.id) ?? false;
                                            const count = c.count ?? 0;
                                            const isDisabled = count === 0 && !selected; // якщо 0 і ще не вибрано — дизейбл
                                            return (_jsxs("button", { onClick: () => toggleCarrier(c.id), disabled: isDisabled, className: `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${selected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : isDisabled
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:bg-accent"}`, "aria-pressed": selected ? "true" : "false", "aria-disabled": isDisabled ? "true" : "false", title: isDisabled
                                                    ? "Немає результатів за поточними фільтрами"
                                                    : undefined, children: [_jsx("span", { children: c.label }), _jsx("span", { className: `min-w-5 rounded-full px-1 text-[11px] ${selected
                                                            ? "bg-primary-foreground/20"
                                                            : "bg-muted text-foreground/80"}`, children: count })] }, c.id));
                                        }) })] }), _jsxs("section", { className: "rounded-xl border p-3", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(ChevronDown, { className: "h-5 w-5" }), _jsx("h4", { className: "text-sm font-semibold", children: t("sort") ?? "Сортування" })] }), _jsx("div", { className: "grid grid-cols-4 gap-2 text-sm", children: [
                                            {
                                                key: "time-asc",
                                                label: t("time.asc") ?? "Час ↑",
                                            },
                                            {
                                                key: "time-desc",
                                                label: t("time.desc") ?? "Час ↓",
                                            },
                                            {
                                                key: "price-asc",
                                                label: t("price.asc") ?? "Ціна ↑",
                                            },
                                            {
                                                key: "price-desc",
                                                label: t("price.desc") ?? "Ціна ↓",
                                            },
                                        ].map((opt) => (_jsx("button", { onClick: () => setDraft((d) => ({
                                                ...d,
                                                sort: opt.key,
                                            })), className: `rounded-lg border px-2 py-1 hover:bg-accent ${draft.sort === opt.key
                                                ? "border-primary font-semibold"
                                                : ""}`, children: opt.label }, opt.key))) })] })] }), _jsx("div", { className: "absolute inset-x-0 bottom-0 border-t bg-card p-3", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "h-10 rounded-xl border px-4 text-sm hover:bg-accent", children: t("cancel") ?? "Скасувати" }), _jsx("button", { onClick: apply, className: "h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95", children: t("apply") ?? "Застосувати" })] }) })] })] }));
}
/* =============== Small UI atoms =============== */
function LabeledInput({ label, type = "text", inputMode, min, value, onChange, }) {
    return (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: label }), _jsx("input", { type: type, inputMode: inputMode, min: min, value: value, onChange: (e) => onChange(e.target.value), className: "h-10 rounded-lg border bg-input-background px-3 outline-none" })] }));
}
function CheckRow({ icon: Icon, label, checked, onChange, }) {
    return (_jsxs("button", { type: "button", onClick: () => onChange(!checked), className: `inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-sm hover:bg-accent ${checked ? "border-primary" : ""}`, "aria-pressed": checked ? "true" : "false", children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: label }), checked && _jsx(Check, { className: "h-4 w-4" })] }));
}
function TogglePill({ active, onClick, icon: Icon, label, }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: `flex items-center justify-center gap-2 rounded-full border px-3 py-2 ${active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"}`, "aria-pressed": active ? "true" : "false", children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm", children: label })] }));
}
export default CMPResultFiltersSheet;
