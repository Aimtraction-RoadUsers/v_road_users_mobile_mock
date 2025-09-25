// src/components/cmpSECGONow.tsx
import { useMemo, useState } from "react";
import {
  Car,
  Navigation,
  ParkingMeter,
  Bike,
  Bus,
  MapPin,
  Clock,
  Calendar,
  ArrowRight,
  ArrowUpDown,
  Crosshair,
  X,
  Info,
} from "lucide-react";
import { useI18n } from "../I18nProvider";
import { useAvailability, type ModeId } from "../useAvailability";
import { CMPAvailabilityBadge } from "./cmpAvailabilityBadge";
import { noteToText } from "../noteI18n";

type Props = {
  onStartDrive?: (
    from: string,
    to: string,
    whenISO?: string,
  ) => void;
  onChooseShare?: (
    from: string,
    to: string,
    whenISO?: string,
  ) => void;
  onChooseTaxi?: (
    from: string,
    to: string,
    whenISO?: string,
  ) => void;
  onChooseScooter?: (
    from: string,
    to: string,
    whenISO?: string,
  ) => void;
  onOpenParking?: (near: string, whenISO?: string) => void; // near = to
};

/* ========= Quick suggested locations ========= */
function QuickLocationChips({
  onPick,
}: {
  onPick: (preset: { from: string; to: string }) => void;
}) {
  // ⚙️ Замінюй під своє місто/сценарії
  const presets = [
    {
      label: "Центр → Аеропорт",
      from: "Львів Центр",
      to: "Львів Аеропорт",
    },
    {
      label: "Оперний → Ринок",
      from: "Львів Оперний",
      to: "Площа Ринок",
    },
    {
      label: "Сокільники → Центр",
      from: "Сокільники",
      to: "Львів Центр",
    },
    { label: "Lviv → Kyiv", from: "Lviv", to: "Kyiv" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => onPick({ from: p.from, to: p.to })}
          className="text-xs rounded-full border px-3 py-1 hover:bg-accent"
          aria-label={`Use preset ${p.label}`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/* ========= Transport chooser modal ========= */
function ModeChooserModal({
  open,
  onClose,
  onChoose,
  availability,
  loading,
  t,
}: {
  open: boolean;
  onClose: () => void;
  onChoose: (mode: ModeId) => void;
  availability: ReturnType<
    typeof useAvailability
  >["availability"];
  loading: boolean;
  t: (k: string) => string;
}) {
  if (!open) return null;

  const modes = [
    {
      id: "drive" as const,
      label: t("mode.drive"),
      sub: t("mode.drive.sub"),
      Icon: Car,
    },
    {
      id: "share" as const,
      label: t("mode.share"),
      sub: t("mode.share.sub"),
      Icon: Bus,
    },
    {
      id: "taxi" as const,
      label: t("mode.taxi"),
      sub: t("mode.taxi.sub"),
      Icon: Car,
    },
    {
      id: "scooter" as const,
      label: t("mode.scooter"),
      sub: t("mode.scooter.sub"),
      Icon: Bike,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* modal */}
      <div className="relative z-10 w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl bg-card text-card-foreground shadow-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">
              {t("choose.transport.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("choose.transport.desc")}
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {modes.map(({ id, label, sub, Icon }) => {
            const a = availability[id];
            const disabled = loading || a.status === "na";
            const noteText = noteToText(a.noteCode, t);
            return (
              <button
                key={id}
                onClick={() => !disabled && onChoose(id)}
                disabled={disabled}
                className={`rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:bg-accent
                  ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-6 w-6 text-foreground/80 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {label}
                      </div>
                      <CMPAvailabilityBadge
                        status={a.status}
                        loading={loading}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sub}
                    </div>
                    {noteText && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />{" "}
                        {noteText}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========= Main component ========= */
export function CMPSECGONow({
  onStartDrive,
  onChooseShare,
  onChooseTaxi,
  onChooseScooter,
  onOpenParking,
}: Props) {
  const { t, lang } = useI18n();

  // From/To
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // Date/Time defaults
  const [rideDate, setRideDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [rideTime, setRideTime] = useState<string>(() => {
    const d = new Date();
    const minutes = Math.ceil(d.getMinutes() / 5) * 5;
    d.setMinutes(minutes, 0, 0);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  // When ISO
  const whenISO = useMemo(() => {
    if (!rideDate || !rideTime) return undefined;
    const [y, m, d] = rideDate.split("-").map(Number);
    const [hh, mm] = rideTime.split(":").map(Number);
    const dt = new Date(
      y,
      (m ?? 1) - 1,
      d ?? 1,
      hh ?? 0,
      mm ?? 0,
      0,
      0,
    );
    return dt.toISOString();
  }, [rideDate, rideTime]);

  const hasFrom = from.trim().length > 0;
  const hasTo = to.trim().length > 0;
  const notSamePlace = from.trim() !== to.trim();
  const isFuture = useMemo(
    () =>
      whenISO
        ? new Date(whenISO).getTime() >= Date.now()
        : false,
    [whenISO],
  );
  const canProceed =
    hasFrom && hasTo && notSamePlace && isFuture;

  // Availability with debounce + loading
  const { availability, loading } = useAvailability(
    from,
    to,
    whenISO,
    {
      debounceMs: 400,
      // fetcher: myBackendFetcher, // ← сюди легко підключити бекенд
    },
  );

  // Modal state
  const [chooserOpen, setChooserOpen] = useState(false);

  const swapFromTo = () => {
    setFrom((prevFrom) => {
      const nextFrom = to;
      setTo(prevFrom);
      return nextFrom;
    });
  };

  const useCurrentLocation = () =>
    setFrom(t("use.my.location"));

  // Handle mode choose
  const chooseAndGo = (mode: ModeId) => {
    setChooserOpen(false);
    if (!canProceed) return;
    if (mode === "drive") onStartDrive?.(from, to, whenISO);
    if (mode === "share") onChooseShare?.(from, to, whenISO);
    if (mode === "taxi") onChooseTaxi?.(from, to, whenISO);
    if (mode === "scooter")
      onChooseScooter?.(from, to, whenISO);
  };

  // Parking hint
  const parkingHint = useMemo(() => {
    if (!hasTo) return null;
    return {
      place: to,
      price: "₴25/год",
      distance: "120 м",
      provider: "CityParking",
    };
  }, [hasTo, to]);

  return (
    <div className="max-w-md mx-auto px-4 space-y-6">
      {/* HERO / INPUTS */}
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Navigation className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {t("go.nowOrPlan")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("go.hint")}
            </p>
          </div>
        </div>

        {/* Quick suggested locations */}
        <div className="mt-3">
          <QuickLocationChips
            onPick={({ from: f, to: tt }) => {
              setFrom(f);
              setTo(tt);
            }}
          />
        </div>

        {/* From / To */}
        <div className="mt-4 space-y-2">
          {/* From */}
          <label className="rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={t("from")}
              aria-label={t("from")}
              className="w-full bg-transparent outline-none"
            />
            {!hasFrom && (
              <button
                type="button"
                onClick={useCurrentLocation}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <Crosshair className="h-3.5 w-3.5" />{" "}
                {t("use.my.location")}
              </button>
            )}
          </label>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapFromTo}
              className="mx-auto my-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              aria-label={t("swap")}
            >
              <ArrowUpDown className="h-4 w-4" /> {t("swap")}
            </button>
          </div>

          {/* To */}
          <label className="rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={t("to")}
              aria-label={t("to")}
              className="w-full bg-transparent outline-none"
            />
          </label>
        </div>

        {/* Date & Time */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label
            className="rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2"
            aria-label={t("date")}
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={rideDate}
              min={rideDate}
              onChange={(e) => setRideDate(e.target.value)}
              className="w-full bg-transparent outline-none"
              lang={lang}
            />
          </label>

          <label
            className="rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2"
            aria-label={t("time")}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <input
              type="time"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
              className="w-full bg-transparent outline-none"
              step={300}
              lang={lang}
            />
          </label>
        </div>

        {/* Build -> open chooser */}
        <button
          disabled={!canProceed}
          onClick={() => canProceed && setChooserOpen(true)}
          className="mt-3 h-12 w-full rounded-xl bg-primary text-primary-foreground transition hover:opacity-95 disabled:opacity-60 flex items-center justify-center"
        >
          <span className="inline-flex items-center gap-2">
            {t("build.route")}{" "}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* INFO CARDS (натискання також відкриває модалку) */}
      <div className="space-y-3">
        <div className="mb-1 text-center">
          <h3 className="text-lg font-semibold">
            {t("choose.mode")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("share.tip")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              id: "drive" as const,
              Icon: Car,
              label: t("mode.drive"),
              sub: t("mode.drive.sub"),
            },
            {
              id: "share" as const,
              Icon: Bus,
              label: t("mode.share"),
              sub: t("mode.share.sub"),
            },
            {
              id: "taxi" as const,
              Icon: Car,
              label: t("mode.taxi"),
              sub: t("mode.taxi.sub"),
            },
            {
              id: "scooter" as const,
              Icon: Bike,
              label: t("mode.scooter"),
              sub: t("mode.scooter.sub"),
            },
          ].map(({ id, Icon, label, sub }) => {
            const a = availability[id];
            const noteText = noteToText(a.noteCode, t);
            return (
              <button
                key={id}
                disabled={
                  !canProceed || loading || a.status === "na"
                }
                onClick={() => setChooserOpen(true)}
                className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:bg-accent disabled:opacity-60"
                aria-label={label}
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-6 w-6 text-foreground/80 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {label}
                      </div>
                      <CMPAvailabilityBadge
                        status={a.status}
                        loading={loading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sub}
                    </p>
                    {noteText && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />{" "}
                        {noteText}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SMART PARKING HINT */}
      {parkingHint && (
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ParkingMeter className="h-5 w-5 text-foreground/80" />
              <div className="text-sm font-semibold">
                {t("parking.near")} «{parkingHint.place}»
              </div>
            </div>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700">
              {t("recommended")}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {parkingHint.price} • {parkingHint.distance} •{" "}
            {parkingHint.provider}
          </div>
          {typeof onOpenParking === "function" && (
            <button
              className="mt-3 h-12 w-full rounded-xl bg-primary text-primary-foreground transition hover:opacity-95 flex items-center justify-center"
              onClick={() => onOpenParking?.(to, whenISO)}
            >
              {t("choose.parking")}
            </button>
          )}
        </div>
      )}

      {/* MODE CHOOSER MODAL */}
      <ModeChooserModal
        open={chooserOpen}
        onClose={() => setChooserOpen(false)}
        onChoose={chooseAndGo}
        availability={availability}
        loading={loading}
        t={t}
      />
    </div>
  );
}