import { type Availability } from "../useAvailability";
import { useI18n } from "../I18nProvider";
export function CMPAvailabilityBadge({
  status,
  loading,
}: {
  status?: Availability;
  loading?: boolean;
}) {
  const { t } = useI18n();
  if (loading) {
    return (
      <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 animate-pulse">
        {" "}
        {t("availability.checking")}{" "}
      </span>
    );
  }
  if (!status) return null;
  const color =
    status === "available"
      ? "bg-emerald-100 text-emerald-700"
      : status === "limited"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";
  const label =
    status === "available"
      ? t("availability.available")
      : status === "limited"
        ? t("availability.limited")
        : t("availability.na");
  return (
    <span
      className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}
    >
      {" "}
      {label}{" "}
    </span>
  );
}
