// src/components/cmpResults.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  Car,
  Bus,
  Train,
  User,
  Clock,
  Wallet,
  Users,
  Ticket,
  CalendarClock,
  Info,
} from "lucide-react";
import { useI18n } from "../I18nProvider";
import {
  defaultFilters,
  type ResultFilters,
} from "../resultsFiltering";

import { CMPActiveFiltersBar } from "./cmpActiveFiltersBar";
import { type CarpoolOffer, type BusOffer, type TrainOffer } from "../resultsFiltering";



/* ===================== Props ===================== */
type Props = {
  modeLabel?: string; // "Підсадка / Автобус / Залізниця"
  from?: string;
  to?: string;
  whenISO?: string;

  carpool: CarpoolOffer[];
  buses: BusOffer[];
  trains: TrainOffer[];

  loadingCarpool?: boolean;
  loadingBuses?: boolean;
  loadingTrains?: boolean;

  onBack?: () => void;
  onOpenFilters?: () => void;
  onSortChange?: (sortKey: string) => void;

  onBookCarpool?: (offer: CarpoolOffer) => void;
  onBuyBus?: (offer: BusOffer) => void;
  onBuyTrain?: (offer: TrainOffer) => void;
  filtersActive?: boolean;
  filtersActiveCount?: number;
  onClearAllFilters?: () => void;
  filters?: ResultFilters; // 🔹 нове
  onFiltersChange?: (next: ResultFilters) => void; // 🔹 нове
  onOpenDetail?: (
    mode: "carpool" | "bus" | "train",
    offerId: string,
    entryPoint: "card" | "primaryCta",
  ) => void;
};

/* ===================== Helpers ===================== */
function formatUAH(n: number) {
  try {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} грн`;
  }
}

/* ================= Skeletons (animate-pulse) ================= */
function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`h-3 w-full rounded bg-muted animate-pulse ${className}`} />
  );
}

function SkeletonButton() {
  return <div className="h-9 w-28 rounded-xl bg-muted animate-pulse" />;
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-6 w-6 rounded bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-2/5" />
          <SkeletonLine className="w-3/5" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
          </div>
        </div>
        <SkeletonButton />
      </div>
    </div>
  );
}

/* ===================== Empty blocks ===================== */
function EmptyBlock({
  icon,
  title,
  message,
  showFilterHint = false,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  showFilterHint?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-dashed p-6 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
        <Icon className="h-5 w-5 text-accent-foreground" />
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{message}</div>
      {showFilterHint && (
        <div className="mt-2 text-sm text-muted-foreground">
          Змініть дату та/або скиньте фільтри
        </div>
      )}
    </div>
  );
}

/* ===================== Block headers ===================== */
function BlockHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
  );
}

/* ===================== Cards ===================== */
function CarpoolCard({
  offer,
  onClick,
}: {
  offer: CarpoolOffer;
  onClick?: (e: any) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Car className="h-6 w-6 text-foreground/80" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Водій: {offer.driverName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>Авто: {offer.carModel}</span>
            </div>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Час: {offer.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              <span>Ціна: {formatUAH(offer.priceUAH)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Місць: {offer.seatsLeft}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClick}
          className="h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95"
        >
          Забронювати
        </button>
      </div>
    </div>
  );
}

function BusCard({
  offer,
  onClick,
}: {
  offer: BusOffer;
  onClick?: (e: any) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Bus className="h-6 w-6 text-foreground/80" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{offer.routeTitle}</div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>Відправлення: {offer.departTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ticket className="h-4 w-4" />
              <span>Ціна: {formatUAH(offer.priceUAH)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClick}
          className="h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95"
        >
          Купити квиток
        </button>
      </div>
    </div>
  );
}

function TrainCard({
  offer,
  onClick,
}: {
  offer: TrainOffer;
  onClick?: (e: any) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Train className="h-6 w-6 text-foreground/80" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{offer.trainTitle}</div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>Відправлення: {offer.departTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ticket className="h-4 w-4" />
              <span>Ціна: {formatUAH(offer.priceUAH)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClick}
          className="h-9 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95"
        >
          Купити квиток
        </button>
      </div>
    </div>
  );
}

/* ===================== Main ===================== */
export function CMPResults({
  modeLabel = "Підсадка / Автобус / Залізниця",
  from,
  to,
  whenISO,
  carpool,
  buses,
  trains,
  loadingCarpool = false,
  loadingBuses = false,
  loadingTrains = false,
  onBack,
  onOpenFilters,
  onSortChange,
  filtersActive,
  filtersActiveCount,
  onClearAllFilters,
  // 🔹 нові пропси
  filters: filtersProp,
  onFiltersChange,
  onOpenDetail,
}: Props) {
  const filters = filtersProp ?? defaultFilters;
  const { t } = useI18n();
  const [sortKey, setSortKey] = useState<string>("time-asc");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Закривати по кліку поза меню
  useEffect(() => {
    if (!sortOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [sortOpen]);

  const handleSort = (key: string) => {
    setSortKey(key);
    onSortChange?.(key);
    setSortOpen(false); // 🔑 закриваємо після вибору
  };

  const subtitle = useMemo(() => {
    const parts = [];
    if (from) parts.push(from);
    if (to) parts.push("→ " + to);
    return parts.join(" ");
  }, [from, to]);


  return (
    <div className="mx-auto max-w-2xl px-4 py-3 space-y-6">
      {/* ======= Header ======= */}
      <header className="sticky top-0 z-30 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm hover:opacity-80"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t("back") ?? "Назад"}</span>
          </button>

          <div className="min-w-0 flex-1 px-2 text-center">
            <div className="truncate text-sm font-semibold">
              {t("travel.mode") ?? "Спосіб доїзду"}: {modeLabel}
            </div>
            {subtitle && (
              <div className="truncate text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
            {whenISO && (
              <div className="truncate text-[11px] text-muted-foreground">
                {new Date(whenISO).toLocaleString("uk-UA")}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Кнопка Скинути, показуємо лише коли є активні фільтри */}
            {filtersActive && (
              <button
                onClick={onClearAllFilters}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-accent"
                title="Скинути всі фільтри"
              >
                Скинути
              </button>
            )}

            {/* Фільтри з бейджем */}
            <div className="relative">
              <button
                onClick={onOpenFilters}
                className="relative inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
              >
                <Filter className="h-4 w-4" />
                <span>{t("filters") ?? "Фільтри"}</span>

                {filtersActive && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                    {Math.min(filtersActiveCount ?? 1, 9)}
                  </span>
                )}
              </button>
            </div>

            {/* SORT POPOVER */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-accent"
                aria-expanded={sortOpen ? "true" : "false"}
                aria-haspopup="menu"
              >
                <span>{t("sort") ?? "Сортування"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sortOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-sm"
                >
                  {[
                    { key: "time-asc", label: "Час ↑" },
                    { key: "time-desc", label: "Час ↓" },
                    { key: "price-asc", label: "Ціна ↑" },
                    { key: "price-desc", label: "Ціна ↓" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      role="menuitem"
                      onClick={() => handleSort(opt.key)}
                      className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-accent ${
                        sortKey === opt.key ? "font-semibold" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Чіпи під хедером — показуємо тільки якщо прокинули onFiltersChange */}
      {onFiltersChange && (
        <div className="-mx-4 border-b bg-background/80 backdrop-blur px-4">
          <div className="mx-auto max-w-2xl py-2">
            <CMPActiveFiltersBar filters={filters} onChange={onFiltersChange} />
          </div>
        </div>
      )}

      {/* ======= Carpool Block ======= */}
      <section className="space-y-3">
        <BlockHeader icon={Car} title={`🚗 Підсадка (${carpool.length})`} />
        {loadingCarpool ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : carpool.length ? (
          carpool.map((o) => (
            <article
              key={o.id}
              className="rounded-xl border p-3 hover:bg-accent cursor-pointer"
              onClick={() => onOpenDetail?.("carpool", o.id, "card")} // 👈 тап по карточці
            >
              <CarpoolCard
                key={o.id}
                offer={o}
                onClick={(e) => {
                  e.stopPropagation(); // щоб не спрацював tap по карточці
                  onOpenDetail?.("carpool", o.id, "primaryCta"); // 👈 натискання primary CTA
                }}
              />
            </article>
          ))
        ) : (
          <EmptyBlock
            icon={Car}
            title="Підсадка"
            message="Немає пропозицій на цю дату/маршрут"
            showFilterHint={!!filtersActive}
          />
        )}
      </section>

      {/* ======= Bus Block ======= */}
      <section className="space-y-3">
        <BlockHeader icon={Bus} title={`🚌 Автобуси (${buses.length})`} />
        {loadingBuses ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : buses.length ? (
          buses.map((o) => (
            <article
              key={o.id}
              className="rounded-xl border p-3 hover:bg-accent cursor-pointer"
              onClick={() => onOpenDetail?.("bus", o.id, "card")} // 👈 тап по карточці
            >
              <BusCard
                key={o.id}
                offer={o}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail?.("bus", o.id, "primaryCta");
                }}
              />
            </article>
          ))
        ) : (
          <EmptyBlock
            icon={Bus}
            title="Автобуси"
            message="Немає рейсів на цю дату"
            showFilterHint={!!filtersActive}
          />
        )}
      </section>

      {/* ======= Train Block ======= */}
      <section className="space-y-3">
        <BlockHeader icon={Train} title={`🚆 Залізниця (${trains.length})`} />
        {loadingTrains ? (
          <>
            <CardSkeleton />
          </>
        ) : trains.length ? (
          trains.map((o) => (
            <article
              key={o.id}
              className="rounded-xl border p-3 hover:bg-accent cursor-pointer"
              onClick={() => onOpenDetail?.("train", o.id, "card")} // 👈 тап по карточці
            >
              <TrainCard
                key={o.id}
                offer={o}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail?.("train", o.id, "primaryCta");
                }}
              />
            </article>
          ))
        ) : (
          <EmptyBlock
            icon={Train}
            title="Залізниця"
            message="Немає рейсів на цю дату"
            showFilterHint={!!filtersActive}
          />
        )}
      </section>

      {/* ======= Inline tip ======= */}
      <div className="rounded-xl border bg-card p-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4" />
          <p>
            Порада: змініть час відправлення або сусідній район — шанси знайти
            варіант зростуть.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CMPResults;
