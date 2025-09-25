import { useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CMPResults } from "./cmpResults";
import { CMPResultFiltersSheet } from "./cmpResultFiltersSheet";

import {
  applyFilters,
  isFilterActive,
  countActiveFilters,
  defaultFilters,
  type ResultFilters,
} from "../resultsFiltering";

import {
  mockCarpool,
  mockBuses,
  mockTrains,
  mockCarriers,
} from "../mobility-mock";



export function SECResultsPageContainer({ onBack }: { onBack: () => void }) {
  const topRef = useRef<HTMLDivElement | null>(null);
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const whenISO = sp.get("when") ?? undefined;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ResultFilters>(defaultFilters);

  const active = isFilterActive(filters);
  const activeCount = countActiveFilters(filters);

  const resetAll = () => setFilters(defaultFilters);

  // 👇 стан деталки:

  // 💡 Тут «сире» джерело (API в майбутньому), поки — моки
  const raw = {
    carpool: mockCarpool,
    buses: mockBuses,
    trains: mockTrains,
  };

  // 🧠 Застосовуємо фільтри та сортування на фронті
  const filtered = useMemo(() => applyFilters(filters, raw), [filters, raw]);



  const onApplyFilters = (next: ResultFilters) => {
    setFilters(next);
    setFiltersOpen(false);
    // 🔽 дочекатись закриття шита й прокрутити
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // або: window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const onSortChange = (key: string) => {
    setFilters((f) => ({ ...f, sort: key as any }));
    // (опційно) скрол догори і при сортуванні:
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // 🔑 ВАЖЛИВО: визначаємо onOpenDetail тут
  const onOpenDetail = (
    mode: "carpool" | "bus" | "train",
    id: string,
    entryPoint: "card" | "primaryCta",
  ) => {
    const qs = new URLSearchParams({
      entry: entryPoint,
      from,
      to,
      when: whenISO ?? "",
    });
    navigate(`/mobility/carpool/detail/${mode}/${id}?${qs.toString()}`);
  };

  return (
    <>
      {/* 🔖 Якір для скролу */}
      <div ref={topRef} />
      <CMPResults
        modeLabel="Підсадка / Автобус / Залізниця"
        from={from}
        to={to}
        whenISO={whenISO}
        carpool={filtered.carpool} 
        buses={filtered.buses}
        trains={filtered.trains}
        onOpenFilters={() => setFiltersOpen(true)}
        onSortChange={onSortChange}
        // 🔹 прокидаємо фільтри ДО cmpResults
        filters={filters}
        onFiltersChange={setFilters}
        onBack={onBack} // 🔑 оце дозволяє вернутись назад
        filtersActive={active}
        filtersActiveCount={activeCount}
        onClearAllFilters={resetAll}
        onOpenDetail={onOpenDetail} /* 👈 тепер через роутер */
      />

      {/* Bottom sheet */}
      <CMPResultFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={onApplyFilters} // ⬅️ тут
        carrierOptions={mockCarriers}
      />
    </>
  );
}

