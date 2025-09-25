// src/lib/carrierCounts.ts
import {
   applyFilters,
  type NormalizedResults,
  type ResultFilters,
} from "./resultsFiltering";

type CountMap = Record<string, number>;

export function computeCarrierCounts(
  raw: NormalizedResults,
  filters: ResultFilters,
): CountMap {
  // 1) Візьмемо всі фільтри КРІМ carriers → щоб лічильники були незалежні
  const { carriers, carrierNames, ...rest } = filters;

  // 2) Застосуємо інші фільтри та сортування (сортування не впливає, але не шкодить)
  const filtered = applyFilters(
    { ...rest, carriers: [], carrierNames: [] },
    raw,
  );

  // 3) Накопичимо кількість по carrierId (fallback на carrierName)
  const acc: CountMap = {};

  const bump = (id?: string, name?: string) => {
    const key = id || (name ? name.toLowerCase().trim() : "");
    if (!key) return;
    acc[key] = (acc[key] ?? 0) + 1;
  };

  filtered.carpool.forEach((o) =>
    bump(o.carrierId, o.carrierName),
  );
  filtered.buses.forEach((o) =>
    bump(o.carrierId, o.carrierName),
  );
  filtered.trains.forEach((o) =>
    bump(o.carrierId, o.carrierName),
  );

  return acc;
}