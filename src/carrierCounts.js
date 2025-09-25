// src/lib/carrierCounts.ts
import { applyFilters, } from "./resultsFiltering";
export function computeCarrierCounts(raw, filters) {
    // 1) Візьмемо всі фільтри КРІМ carriers → щоб лічильники були незалежні
    const { carriers, carrierNames, ...rest } = filters;
    // 2) Застосуємо інші фільтри та сортування (сортування не впливає, але не шкодить)
    const filtered = applyFilters({ ...rest, carriers: [], carrierNames: [] }, raw);
    // 3) Накопичимо кількість по carrierId (fallback на carrierName)
    const acc = {};
    const bump = (id, name) => {
        const key = id || (name ? name.toLowerCase().trim() : "");
        if (!key)
            return;
        acc[key] = (acc[key] ?? 0) + 1;
    };
    filtered.carpool.forEach((o) => bump(o.carrierId, o.carrierName));
    filtered.buses.forEach((o) => bump(o.carrierId, o.carrierName));
    filtered.trains.forEach((o) => bump(o.carrierId, o.carrierName));
    return acc;
}
