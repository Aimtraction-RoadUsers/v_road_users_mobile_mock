// src/components/cmpResultFiltersSheet.tsx
import { useEffect,useRef, useState } from "react";
import {
  X,
  Check,
  Clock,
  Wallet,
  Users,
  ShieldCheck,
  Zap,
  Car,
  Bus,
  Train,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "../I18nProvider";

export type ResultFilters = {
  // price in UAH
  priceMin?: number;
  priceMax?: number;

  // departure time window (HH:MM 24h)
  departFrom?: string;
  departTo?: string;

  // min seats (for carpool)
  minSeats?: number;

  // flags
  onlyVerified?: boolean;
  onlyInstantBooking?: boolean;

  // transport modes toggles
  modes?: {
    carpool: boolean;
    bus: boolean;
    train: boolean;
  };

  // selected carriers (ids or names)
  carriers?: string[];

  // sort key
  sort?: "time-asc" | "time-desc" | "price-asc" | "price-desc";
};

type Props = {
  open: boolean;
  onClose: () => void;
  value: ResultFilters;
  onApply: (next: ResultFilters) => void;

  // optional provider list for “carriers”
  carrierOptions?: Array<{ id: string; label: string }>;
};

export function CMPResultFiltersSheet({
  open,
  onClose,
  value,
  onApply,
  carrierOptions = [
    { id: "flix", label: "FlixBus" },
    { id: "gunsel", label: "Gunsel" },
    { id: "udz", label: "Укрзалізниця" },
  ],
}: Props) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<ResultFilters>(value);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // keep local draft in sync when parent changes
  useEffect(() => setDraft(value), [value]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggleMode = (
    k: keyof NonNullable<ResultFilters["modes"]>,
  ) =>
    setDraft((d) => ({
      ...d,
      modes: {
        ...(d.modes ?? {
          carpool: true,
          bus: true,
          train: true,
        }),
        [k]: !(d.modes ?? ({} as any))[k],
      },
    }));

  const toggleCarrier = (id: string) =>
    setDraft((d) => {
      const set = new Set(d.carriers ?? []);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...d, carriers: Array.from(set) };
    });

  const reset = () =>
    setDraft({
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-2xl bg-card text-card-foreground shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Grab handle */}
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted" />

        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3">
          <div>
            <h3 className="text-lg font-semibold">
              {t("filters") ?? "Фільтри"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("filters.desc") ??
                "Задайте параметри для точнішого підбору"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-accent"
              aria-label="Reset filters"
            >
              <RotateCcw className="h-4 w-4" />
              {t("reset") ?? "Скинути"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content (scrollable) */}
        <div className="grid max-h-[62vh] gap-4 overflow-y-auto px-4 pb-24">
          {/* Modes */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Car className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("filters.modes") ?? "Режими"}
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <TogglePill
                active={draft.modes?.carpool ?? true}
                onClick={() => toggleMode("carpool")}
                icon={Car}
                label={t("mode.share") ?? "Підсадка"}
              />
              <TogglePill
                active={draft.modes?.bus ?? true}
                onClick={() => toggleMode("bus")}
                icon={Bus}
                label={t("bus") ?? "Автобуси"}
              />
              <TogglePill
                active={draft.modes?.train ?? true}
                onClick={() => toggleMode("train")}
                icon={Train}
                label={t("train") ?? "Залізниця"}
              />
            </div>
          </section>

          {/* Time window */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("filters.time") ?? "Depart time"}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <LabeledInput
                label={t("from") ?? "Від"}
                type="time"
                value={draft.departFrom ?? ""}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, departFrom: v }))
                }
              />
              <LabeledInput
                label={t("to") ?? "До"}
                type="time"
                value={draft.departTo ?? ""}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, departTo: v }))
                }
              />
            </div>
          </section>

          {/* Price */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("filters.price") ?? "Price (usd)"}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <LabeledInput
                label={t("min") ?? "Від"}
                type="number"
                inputMode="numeric"
                min={0}
                value={draft.priceMin?.toString() ?? ""}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    priceMin: v ? Number(v) : undefined,
                  }))
                }
              />
              <LabeledInput
                label={t("max") ?? "До"}
                type="number"
                inputMode="numeric"
                min={0}
                value={draft.priceMax?.toString() ?? ""}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    priceMax: v ? Number(v) : undefined,
                  }))
                }
              />
            </div>
          </section>

          {/* Seats + Flags */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("filters.carpool") ?? "Carpool — settings"}
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <LabeledInput
                label={t("filters.minSeats") ?? "Seats from"}
                type="number"
                inputMode="numeric"
                min={1}
                value={draft.minSeats?.toString() ?? ""}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    minSeats: v ? Number(v) : undefined,
                  }))
                }
              />
              <CheckRow
                icon={ShieldCheck}
                label={
                  t("filters.onlyVerified") ??
                  "Only verified drivers"
                }
                checked={!!draft.onlyVerified}
                onChange={(checked) =>
                  setDraft((d) => ({
                    ...d,
                    onlyVerified: checked,
                  }))
                }
              />
              <CheckRow
                icon={Zap}
                label={
                  t("filters.instant") ?? "Instant booking"
                }
                checked={!!draft.onlyInstantBooking}
                onChange={(checked) =>
                  setDraft((d) => ({
                    ...d,
                    onlyInstantBooking: checked,
                  }))
                }
              />
            </div>
          </section>

          {/* Carriers */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Bus className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("filters.carriers") ?? "Carriers"}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {carrierOptions.map((c: any) => {
                const selected =
                  draft.carriers?.includes(c.id) ?? false;
                const count = c.count ?? 0;
                const isDisabled = count === 0 && !selected; // якщо 0 і ще не вибрано — дизейбл

                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCarrier(c.id)}
                    disabled={isDisabled}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-accent"
                    }`}
                    aria-pressed={selected ? "true" : "false"}
                    aria-disabled={
                      isDisabled ? "true" : "false"
                    }
                    title={
                      isDisabled
                        ? "No results with the current filters"
                        : undefined
                    }
                  >
                    <span>{c.label}</span>
                    <span
                      className={`min-w-5 rounded-full px-1 text-[11px] ${
                        selected
                          ? "bg-primary-foreground/20"
                          : "bg-muted text-foreground/80"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sort */}
          <section className="rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2">
              <ChevronDown className="h-5 w-5" />
              <h4 className="text-sm font-semibold">
                {t("sort") ?? "Sort by"}
              </h4>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {[
                {
                  key: "time-asc",
                  label: t("time.asc") ?? "Time ↑",
                },
                {
                  key: "time-desc",
                  label: t("time.desc") ?? "Time ↓",
                },
                {
                  key: "price-asc",
                  label: t("price.asc") ?? "Price ↑",
                },
                {
                  key: "price-desc",
                  label: t("price.desc") ?? "Price ↓",
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      sort: opt.key as any,
                    }))
                  }
                  className={`rounded-lg border px-2 py-1 hover:bg-accent ${
                    draft.sort === opt.key
                      ? "border-primary font-semibold"
                      : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="absolute inset-x-0 bottom-0 border-t bg-card p-3">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-10 rounded-xl border px-4 text-sm hover:bg-accent"
            >
              {t("cancel") ?? "Cancel"}
            </button>
            <button
              onClick={apply}
              className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              {t("apply") ?? "Apply filters"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== Small UI atoms =============== */
function LabeledInput({
  label,
  type = "text",
  inputMode,
  min,
  value,
  onChange,
}: {
  label: string;
  type?: "text" | "number" | "time";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border bg-input-background px-3 outline-none"
      />
    </label>
  );
}

function CheckRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-sm hover:bg-accent ${
        checked ? "border-primary" : ""
      }`}
      aria-pressed={checked ? "true" : "false"}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {checked && <Check className="h-4 w-4" />}
    </button>
  );
}

function TogglePill({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent"
      }`}
      aria-pressed={active ? "true" : "false"}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

export default CMPResultFiltersSheet;