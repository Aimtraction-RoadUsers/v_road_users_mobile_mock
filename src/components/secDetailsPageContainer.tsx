// src/components/DetailsPageContainer.tsx
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Car,
  Bus,
  Train,
  MapPin,
  Clock,
  Shield,
  User,
  Phone,
  Info,
  Sparkles,
  ChevronRight,
  Ticket,
  Luggage,
  CheckCircle2,
  X,
} from "lucide-react";

/*
  DetailsPageContainer — універсальний контейнер для трьох режимів:
  - carpool (підсадка)
  - bus
  - train

  Фічі:
  - sticky header з кнопкою Назад
  - узагальнений Summary блок (маршрут, час, ціна)
  - специфічні секції під режим (водій/авто, політики, багаж тощо)
  - sticky footer з CTA (Забронювати / Купити квиток / Перейти до провайдера)
  - QuickConfirmSheet (bottom sheet) для однотапної дії
  - entryPoint: "card" | "primaryCta" — за потреби скролимо до CTA
  - skeleton + error/empty стани

  Інтеграційні події:
  - onBack()
  - onConfirm(offerId)
  - onContactDriver(offerId)
  - onRedirectProvider(offerId)

  Як рендерити:
  <DetailsPageContainer
    mode="carpool"
    offer={carpoolOffer}
    onBack={...}
    onConfirm={(id)=>{}}
  />
*/

export type Mode = "carpool" | "bus" | "train";

export type CarpoolDetail = {
  kind: "carpool";
  id: string;
  from: string;
  to: string;
  dateISO: string; // відправлення
  priceUAH: number;
  seatsLeft: number;
  driver: {
    name: string;
    rating?: number;
    trips?: number;
    phoneMasked?: string;
    verified?: boolean;
  };
  car: { model: string; color?: string; plateMasked?: string };
  rules?: string[]; // "Без куріння", "Тихо" і т.д.
  baggage?: string; // "1 рюкзак"
  note?: string;
  provider?: string; // "VPidsadka"
  instant?: boolean; // миттєве бронювання
};

export type BusDetail = {
  kind: "bus";
  id: string;
  routeTitle: string; // Львів → Київ
  dateISO: string; // відправлення
  arrivalISO?: string;
  priceUAH: number;
  carrierId?: string; // flix
  carrierName?: string; // FlixBus
  refundPolicy?: string; // коротко
  luggage?: string; // 1 місце багажу 20кг
  seatSelection?: boolean;
  provider?: string; // агрегатор
};

export type TrainDetail = {
  kind: "train";
  id: string;
  trainTitle: string; // Інтерсіті №743
  from: string;
  to: string;
  dateISO: string; // відправлення
  arrivalISO?: string;
  priceUAH: number;
  carriageType?: string; // Інтерсіті 2-й клас
  seatSelection?: boolean;
  provider?: string; // "Укрзалізниця"
  refundPolicy?: string;
};

export type DetailOffer =
  | CarpoolDetail
  | BusDetail
  | TrainDetail;

export function SECDetailsPageContainer({
  mode,
  offer,
  loading = false,
  entryPoint = "card",
  onBack,
  onConfirm,
  onContactDriver,
  onRedirectProvider,
}: {
  mode: Mode;
  offer?: DetailOffer; // коли loading = true, може бути undefined
  loading?: boolean;
  entryPoint?: "card" | "primaryCta";
  onBack: () => void;
  onConfirm?: (offerId: string) => void; // бронювати/купити
  onContactDriver?: (offerId: string) => void;
  onRedirectProvider?: (offerId: string) => void;
}) {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Автоскрол до CTA якщо зайшли через primaryCta
  useEffect(() => {
    if (
      entryPoint === "primaryCta" &&
      ctaRef.current &&
      !loading
    ) {
      ctaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [entryPoint, loading]);

  if (loading) return <DetailSkeleton onBack={onBack} />;
  if (!offer) return <DetailEmpty onBack={onBack} />;

  const Icon =
    mode === "carpool" ? Car : mode === "bus" ? Bus : Train;

  // Загальні дані
  const from =
    offer.kind === "carpool"
      ? offer.from
      : offer.kind === "train"
        ? offer.from
        : offer.routeTitle.split(" → ")[0];
  const to =
    offer.kind === "carpool"
      ? offer.to
      : offer.kind === "train"
        ? offer.to
        : offer.routeTitle.split(" → ")[1];
  const depart = new Date(offer.dateISO);

  const title =
    offer.kind === "carpool"
      ? `${offer.driver.name} • ${offer.car.model}`
      : offer.kind === "bus"
        ? `${offer.carrierName ?? "Автобус"}`
        : offer.trainTitle;

  const footerCtaLabel =
    offer.kind === "carpool"
      ? offer.instant
        ? "Book instantly"
        : "Send request"
      : offer.kind === "bus"
        ? "Buy ticket"
        : "Buy ticket";

  const handleConfirm = () => {
    if (offer.kind !== "carpool" && onRedirectProvider) {
      // У автобусів/поїздів часто редірект до провайдера
      onRedirectProvider?.(offer.id);
    } else if (onConfirm) {
      onConfirm(offer.id);
    }
    setConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-accent"
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon className="h-4 w-4" />
            <span>
              {from} → {to}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-2xl px-4 py-4 space-y-6">
        {/* Summary */}
        <section className="rounded-xl border p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold">
                {title}
              </div>
              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                <div className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {from} → {to}
                </div>
                <div className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDateTime(depart)}
                </div>
                <div className="inline-flex items-center gap-1">
                  <Ticket className="h-4 w-4" />
                  {offer.priceUAH} грн
                </div>
                {offer.kind === "carpool" && (
                  <div className="inline-flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Seats: {offer.seatsLeft}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Specific sections */}
        {offer.kind === "carpool" && (
          <CarpoolSection
            offer={offer}
            onContactDriver={onContactDriver}
          />
        )}

        {offer.kind === "bus" && <BusSection offer={offer} />}

        {offer.kind === "train" && (
          <TrainSection offer={offer} />
        )}

        {/* Info note */}
        {offer.provider && (
          <div className="rounded-xl border p-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" /> Offer provided by:{" "}
            <span className="ml-1 font-medium text-foreground">
              {offer.provider}
            </span>
          </div>
        )}

        {/* Sticky footer spacer */}
        <div className="h-20" />
      </div>

      {/* Sticky footer CTA */}
      <div
        ref={ctaRef}
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur"
      >
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="font-semibold">
              {offer.priceUAH} usd
            </div>
            <div className="text-muted-foreground text-xs">
              Fees included
            </div>
          </div>
          <div className="flex items-center gap-2">
            {offer.kind === "carpool" && (
              <button
                onClick={() => onContactDriver?.(offer.id)}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
              >
                <Phone className="h-4 w-4" /> Message Driver
              </button>
            )}
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              <Sparkles className="h-4 w-4" /> {footerCtaLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Quick confirm */}
      <QuickConfirmSheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={footerCtaLabel}
        lines={buildConfirmLines(offer)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

/* ============== Sections ============== */
function CarpoolSection({
  offer,
  onContactDriver,
}: {
  offer: CarpoolDetail;
  onContactDriver?: (id: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="rounded-xl border p-4">
        <div className="mb-2 text-sm font-semibold flex items-center gap-2">
          <User className="h-4 w-4" /> Driver
        </div>
        <div className="flex items-start justify-between">
          <div className="text-sm">
            <div className="font-medium">
              {offer.driver.name}{" "}
              {offer.driver.verified && (
                <Shield className="inline h-4 w-4 text-emerald-600 ml-1" />
              )}
            </div>
            <div className="text-muted-foreground">
              Рейтинг: {offer.driver.rating ?? "—"} • Trips:{" "}
              {offer.driver.trips ?? "—"}
            </div>
          </div>
          {onContactDriver && (
            <button
              onClick={() => onContactDriver(offer.id)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent"
            >
              <Phone className="h-4 w-4" /> Write
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <div className="mb-1 text-sm font-semibold flex items-center gap-2">
          <Car className="h-4 w-4" /> Vehicle
        </div>
        <div className="text-sm text-muted-foreground">
          {offer.car.model}
          {offer.car.color ? ` • ${offer.car.color}` : ""}
        </div>
      </div>

      {(offer.rules?.length || offer.baggage || offer.note) && (
        <div className="rounded-xl border p-4 space-y-2">
          <div className="text-sm font-semibold mb-1">
           Conditions
          </div>
          {offer.rules?.length ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-0.5">
              {offer.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : null}
          {offer.baggage && (
            <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Luggage className="h-4 w-4" /> Lagguage:{" "}
              {offer.baggage}
            </div>
          )}
          {offer.note && (
            <div className="text-sm text-muted-foreground inline-flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" /> {offer.note}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function BusSection({ offer }: { offer: BusDetail }) {
  return (
    <section className="space-y-3">
      <div className="rounded-xl border p-4">
        <div className="mb-1 text-sm font-semibold flex items-center gap-2">
          <Bus className="h-4 w-4" /> Carrier
        </div>
        <div className="text-sm text-muted-foreground">
          {offer.carrierName ?? "—"}
        </div>
      </div>
      {(offer.refundPolicy || offer.luggage) && (
        <div className="rounded-xl border p-4 space-y-2">
          <div className="text-sm font-semibold">Conditions</div>
          {offer.refundPolicy && (
            <div className="text-sm text-muted-foreground">
              <Shield className="inline h-4 w-4 mr-1" />{" "}
              {offer.refundPolicy}
            </div>
          )}
          {offer.luggage && (
            <div className="text-sm text-muted-foreground">
              <Luggage className="inline h-4 w-4 mr-1" />{" "}
              {offer.luggage}
            </div>
          )}
        </div>
      )}
      {offer.seatSelection && (
        <div className="rounded-xl border p-4 text-sm text-muted-foreground flex items-center justify-between">
          Seat selection available
          <button className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-accent">
            Choose <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

function TrainSection({ offer }: { offer: TrainDetail }) {
  return (
    <section className="space-y-3">
      <div className="rounded-xl border p-4">
        <div className="mb-1 text-sm font-semibold flex items-center gap-2">
          <Train className="h-4 w-4" /> Потяг
        </div>
        <div className="text-sm text-muted-foreground">
          {offer.trainTitle}
          {offer.carriageType ? ` • ${offer.carriageType}` : ""}
        </div>
      </div>
      {(offer.refundPolicy || offer.seatSelection) && (
        <div className="rounded-xl border p-4 space-y-2">
          <div className="text-sm font-semibold">Conditions</div>
          {offer.refundPolicy && (
            <div className="text-sm text-muted-foreground">
              <Shield className="inline h-4 w-4 mr-1" />{" "}
              {offer.refundPolicy}
            </div>
          )}
          {offer.seatSelection && (
            <div className="text-sm text-muted-foreground">
              Seat selection available)
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ============== QuickConfirmSheet ============== */
function QuickConfirmSheet({
  open,
  onClose,
  title,
  lines,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  lines: { label: string; value: string }[];
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl bg-card text-card-foreground shadow-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="text-lg font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent"
            aria-label="Закрити"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {lines.map((l, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3"
            >
              <div className="text-muted-foreground">
                {l.label}
              </div>
              <div className="font-medium text-right">
                {l.value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            <CheckCircle2 className="h-4 w-4" /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function buildConfirmLines(
  offer: DetailOffer,
): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];
  const depart = new Date(offer.dateISO);
  lines.push({
    label: "Маршрут",
    value:
      offer.kind === "carpool"
        ? `${offer.from} → ${offer.to}`
        : offer.kind === "train"
          ? `${offer.from} → ${offer.to}`
          : offer.routeTitle,
  });
  lines.push({
    label: "Depart",
    value: formatDateTime(depart),
  });
  lines.push({ label: "Price", value: `${offer.priceUAH} грн` });
  if (offer.kind === "carpool") {
    lines.push({ label: "Driver", value: offer.driver.name });
    lines.push({
      label: "Місць",
      value: String(offer.seatsLeft),
    });
  }
  return lines;
}

/* ============== Skeleton / Empty ============== */
function DetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-accent"
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl border bg-muted/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function DetailEmpty({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="mb-3 text-lg font-semibold">
       Offer not found
      </div>
      <div className="text-sm text-muted-foreground">
        It may have been canceled or the departure time has passed.
      </div>
      <button
        onClick={onBack}
        className="mt-4 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
      >
        Back to results
      </button>
    </div>
  );
}

/* ============== Utils ============== */
function formatDateTime(d: Date) {
  try {
    const dd = d.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return dd.replace(",", " •");
  } catch {
    return d.toISOString();
  }
}

// ================= Mock usage example =================
// Можеш створити окремий файл src/mocks/mobilityDetails.ts і звідти брати пропозиції для тесту.
// ================= Mock usage example =================
// You can create a separate file src/mocks/mobilityDetails.ts and import offers from there for testing.
export const mockCarpoolDetail: CarpoolDetail = {
  kind: "carpool",
  id: "c1",
  from: "Lviv",
  to: "Kyiv",
  dateISO: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
  priceUAH: 150,
  seatsLeft: 2,
  driver: {
    name: "Ivan",
    rating: 4.9,
    trips: 132,
    phoneMasked: "+380••• •• ••",
    verified: true,
  },
  car: { model: "Skoda Fabia", color: "silver" },
  rules: ["No smoking", "Quiet", "No pets"],
  baggage: "1 small backpack",
  note: "Meet near the Opera House",
  provider: "VPidsadka",
  instant: true,
};

export const mockBusDetail: BusDetail = {
  kind: "bus",
  id: "b1",
  routeTitle: "Lviv → Kyiv",
  dateISO: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
  arrivalISO: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
  priceUAH: 350,
  carrierId: "flix",
  carrierName: "FlixBus",
  refundPolicy: "Refund up to 24 hours before departure with a fee",
  luggage: "1 piece 20 kg + carry-on",
  seatSelection: true,
  provider: "AggregatorX",
};

export const mockTrainDetail: TrainDetail = {
  kind: "train",
  id: "t1",
  trainTitle: "Intercity No. 743",
  from: "Lviv",
  to: "Kyiv",
  dateISO: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
  arrivalISO: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
  priceUAH: 600,
  carriageType: "2nd class",
  seatSelection: false,
  provider: "Ukrzaliznytsia",
  refundPolicy: "Refunds according to UZ rules",
};