// src/lib/resultsFiltering.ts
// ---------------------------------------------
// FRONT: applyFilters + допоміжні типи/утиліти
// ---------------------------------------------

export type SortKey =
  | "time-asc"
  | "time-desc"
  | "price-asc"
  | "price-desc";

export type ResultFilters = {
  priceMin?: number;
  priceMax?: number;

  // HH:MM (24h)
  departFrom?: string;
  departTo?: string;

  // carpool only
  minSeats?: number;
  onlyVerified?: boolean;
  onlyInstantBooking?: boolean;

  // transport modes toggles
  modes?: {
    carpool: boolean;
    bus: boolean;
    train: boolean;
  };

  // carriers by ID (рекомендовано), або fallback по name
  carriers?: string[]; // e.g. ["flix", "udz"] — IDs
  carrierNames?: string[]; // e.g. ["FlixBus", "Укрзалізниця"]

  sort?: SortKey;
};

// ---- Дані, що відображаються у CMPResults ----
export type CarpoolOffer = {
  id: string;
  driverName: string;
  carModel: string;
  time: string; // "12:30"
  priceUAH: number;
  seatsLeft: number;
  // рекомендовані поля для фільтрів:
  isVerified?: boolean; // для onlyVerified
  isInstantBookable?: boolean; // для onlyInstantBooking
  carrierId?: string; // якщо є агрегатор
  carrierName?: string;
  
};

export type BusOffer = {
  id: string;
  routeTitle: string; // "Львів → Київ"
  departTime: string; // "14:00"
  priceUAH: number;
  carrierId?: string; // "flix", "gunsel", ...
  carrierName?: string; // "FlixBus", "Gunsel"
};

export type TrainOffer = {
  id: string;
  trainTitle: string; // "Інтерсіті №743"
  departTime: string; // "16:20"
  priceUAH: number;
  carrierId?: string; // "udz"
  carrierName?: string; // "Укрзалізниця"
};

export type NormalizedResults = {
  carpool: CarpoolOffer[];
  buses: BusOffer[];
  trains: TrainOffer[];
};

// ---- Утиліти ----
const toMinutes = (hhmm: string | undefined): number | null => {
  if (!hhmm) return null;
  const [hh, mm] = hhmm.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
};

// дефолтні значення, з якими порівнюємо
export const defaultFilters: ResultFilters = {
  modes: { carpool: true, bus: true, train: true },
  sort: "time-asc",
  carriers: [],
};

export function isFilterActive(f: ResultFilters): boolean {
  const eq = (a: any, b: any) =>
    JSON.stringify(a) === JSON.stringify(b);
  // будь-яке поле, відмінне від дефолту, або будь-яке «заповнене» числове/строкове
  return (
    !eq(
      f.modes ?? defaultFilters.modes,
      defaultFilters.modes,
    ) ||
    (f.sort && f.sort !== defaultFilters.sort) ||
    !!(f.priceMin != null || f.priceMax != null) ||
    !!(f.departFrom || f.departTo) ||
    !!(f.minSeats != null) ||
    !!f.onlyVerified ||
    !!f.onlyInstantBooking ||
    !!(f.carriers && f.carriers.length) ||
    !!(f.carrierNames && f.carrierNames.length)
  );
}

// корисно мати і "скільки активних"
export function countActiveFilters(f: ResultFilters): number {
  let n = 0;
  if (
    !JSON.stringify(f.modes ?? defaultFilters.modes).includes(
      `true,true,true`,
    )
  )
    if (f.sort && f.sort !== defaultFilters.sort) n++;
  if (f.priceMin != null || f.priceMax != null) n++;
  if (f.departFrom || f.departTo) n++;
  if (f.minSeats != null) n++;
  if (f.onlyVerified) n++;
  if (f.onlyInstantBooking) n++;
  if (f.carriers?.length) n++;
  if (f.carrierNames?.length) n++;
  return n;
}

const inTimeRange = (
  time: string,
  from?: string,
  to?: string,
) => {
  const t = toMinutes(time);
  if (t == null) return true; // якщо немає валідного часу — не відсіюємо
  const f = toMinutes(from) ?? 0;
  const tt = toMinutes(to) ?? 24 * 60;
  return t >= f && t <= tt;
};

const priceOk = (price: number, min?: number, max?: number) =>
  (min == null || price >= min) &&
  (max == null || price <= max);

const carrierMatches = (
  idOrName: { id?: string; name?: string },
  allowedIds?: string[],
  allowedNames?: string[],
) => {
  if (
    (allowedIds && allowedIds.length) ||
    (allowedNames && allowedNames.length)
  ) {
    const okId = allowedIds?.length
      ? idOrName.id
        ? allowedIds.includes(idOrName.id)
        : false
      : false;
    const okName = allowedNames?.length
      ? idOrName.name
        ? allowedNames
            .map((n) => n.toLowerCase().trim())
            .includes(idOrName.name.toLowerCase().trim())
        : false
      : false;
    return okId || okName;
  }
  return true; // якщо користувач нічого не вибрав — не фільтруємо
};

const sortFactory = (sort?: SortKey) => {
  switch (sort) {
    case "time-asc":
      return (a: any, b: any) => {
        const ta = toMinutes(a.time ?? a.departTime) ?? 0;
        const tb = toMinutes(b.time ?? b.departTime) ?? 0;
        return ta - tb;
      };
    case "time-desc":
      return (a: any, b: any) => {
        const ta = toMinutes(a.time ?? a.departTime) ?? 0;
        const tb = toMinutes(b.time ?? b.departTime) ?? 0;
        return tb - ta;
      };
    case "price-asc":
      return (a: any, b: any) =>
        (a.priceUAH ?? 0) - (b.priceUAH ?? 0);
    case "price-desc":
      return (a: any, b: any) =>
        (b.priceUAH ?? 0) - (a.priceUAH ?? 0);
    default:
      return () => 0;
  }
};

// ---- Головна функція нормалізації (фронт) ----
export function applyFilters(
  filters: ResultFilters,
  data: NormalizedResults,
): NormalizedResults {
  const {
    priceMin,
    priceMax,
    departFrom,
    departTo,
    minSeats,
    onlyVerified,
    onlyInstantBooking,
    modes,
    carriers,
    carrierNames,
    sort,
  } = filters;

  const allowCarpool = modes?.carpool ?? true;
  const allowBus = modes?.bus ?? true;
  const allowTrain = modes?.train ?? true;

  const carpool = allowCarpool
    ? data.carpool.filter(
        (o) =>
          priceOk(o.priceUAH, priceMin, priceMax) &&
          inTimeRange(o.time, departFrom, departTo) &&
          (!minSeats || o.seatsLeft >= minSeats) &&
          (!onlyVerified || !!o.isVerified) &&
          (!onlyInstantBooking || !!o.isInstantBookable) &&
          carrierMatches(
            { id: o.carrierId, name: o.carrierName },
            carriers,
            carrierNames,
          ),
      )
    : [];

  const buses = allowBus
    ? data.buses.filter(
        (o) =>
          priceOk(o.priceUAH, priceMin, priceMax) &&
          inTimeRange(o.departTime, departFrom, departTo) &&
          carrierMatches(
            { id: o.carrierId, name: o.carrierName },
            carriers,
            carrierNames,
          ),
      )
    : [];

  const trains = allowTrain
    ? data.trains.filter(
        (o) =>
          priceOk(o.priceUAH, priceMin, priceMax) &&
          inTimeRange(o.departTime, departFrom, departTo) &&
          carrierMatches(
            { id: o.carrierId, name: o.carrierName },
            carriers,
            carrierNames,
          ),
      )
    : [];

  const s = sortFactory(sort);
  carpool.sort(s);
  buses.sort(s);
  trains.sort(s);

  return { carpool, buses, trains };
}