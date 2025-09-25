import { jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from "../I18nProvider";
export function CMPAvailabilityBadge({ status, loading, }) {
    const { t } = useI18n();
    if (loading) {
        return (_jsxs("span", { className: "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 animate-pulse", children: [" ", t("availability.checking"), " "] }));
    }
    if (!status)
        return null;
    const color = status === "available"
        ? "bg-emerald-100 text-emerald-700"
        : status === "limited"
            ? "bg-amber-100 text-amber-700"
            : "bg-rose-100 text-rose-700";
    const label = status === "available"
        ? t("availability.available")
        : status === "limited"
            ? t("availability.limited")
            : t("availability.na");
    return (_jsxs("span", { className: `ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`, children: [" ", label, " "] }));
}
