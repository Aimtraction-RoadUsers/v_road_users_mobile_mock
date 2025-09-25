// src/components/ActiveFiltersBar.tsx
import { X } from "lucide-react";
import {
  type ResultFilters,
} from "../resultsFiltering";

type Props = {
  filters: ResultFilters;
  onChange: (next: ResultFilters) => void;
};

function Chip({
  children,
  onRemove,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
        disabled ? "opacity-50" : "hover:bg-accent"
      }`}
    >
      {children}
      {!disabled && (
        <button
          aria-label="Remove filter"
          className="p-0.5 rounded hover:bg-muted"
          onClick={onRemove}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

export function CMPActiveFiltersBar({
  filters,
  onChange,
}: Props) {
  const chips: Array<React.ReactNode> = [];

  // Ціна
  if (filters.priceMin != null || filters.priceMax != null) {
    const text =
      filters.priceMin != null && filters.priceMax != null
        ? `Ціна ${filters.priceMin}–${filters.priceMax} грн`
        : filters.priceMin != null
          ? `Ціна від ${filters.priceMin} грн`
          : `Ціна до ${filters.priceMax} грн`;
    chips.push(
      <Chip
        key="price"
        onRemove={() =>
          onChange({
            ...filters,
            priceMin: undefined,
            priceMax: undefined,
          })
        }
      >
        {text}
      </Chip>,
    );
  }

  // Час
  if (filters.departFrom || filters.departTo) {
    const tf = filters.departFrom ?? "00:00";
    const tt = filters.departTo ?? "23:59";
    chips.push(
      <Chip
        key="time"
        onRemove={() =>
          onChange({
            ...filters,
            departFrom: undefined,
            departTo: undefined,
          })
        }
      >
        Час {tf}–{tt}
      </Chip>,
    );
  }

  // Місця (carpool)
  if (filters.minSeats != null) {
    chips.push(
      <Chip
        key="seats"
        onRemove={() =>
          onChange({ ...filters, minSeats: undefined })
        }
      >
        Місць від {filters.minSeats}
      </Chip>,
    );
  }

  // Верифіковані
  if (filters.onlyVerified) {
    chips.push(
      <Chip
        key="verified"
        onRemove={() =>
          onChange({ ...filters, onlyVerified: false })
        }
      >
        Лише верифіковані
      </Chip>,
    );
  }

  // Миттєве бронювання
  if (filters.onlyInstantBooking) {
    chips.push(
      <Chip
        key="instant"
        onRemove={() =>
          onChange({ ...filters, onlyInstantBooking: false })
        }
      >
        Миттєве бронювання
      </Chip>,
    );
  }

  // Режими (показуємо, якщо вимкнули НЕ всі)
  if (
    filters.modes &&
    !(
      filters.modes.carpool &&
      filters.modes.bus &&
      filters.modes.train
    )
  ) {
    const onRemoveMode = () =>
      onChange({
        ...filters,
        modes: { carpool: true, bus: true, train: true },
      });
    const parts = Object.entries(filters.modes)
      .filter(([, v]) => v)
      .map(([k]) =>
        k === "carpool"
          ? "Підсадка"
          : k === "bus"
            ? "Автобуси"
            : "Залізниця",
      )
      .join(", ");
    chips.push(
      <Chip key="modes" onRemove={onRemoveMode}>
        Режими: {parts || "нема"}
      </Chip>,
    );
  }

  // Перевізники (IDs або names)
  const carriersCount =
    (filters.carriers?.length ?? 0) +
    (filters.carrierNames?.length ?? 0);
  if (carriersCount > 0) {
    chips.push(
      <Chip
        key="carriers"
        onRemove={() =>
          onChange({
            ...filters,
            carriers: [],
            carrierNames: [],
          })
        }
      >
        Перевізники: {carriersCount}
      </Chip>,
    );
  }

  // Сортування (можна відобразити, але без хрестика)
  // якщо не хочеш показувати — забери блок
  if (filters.sort && filters.sort !== "time-asc") {
    const map: Record<string, string> = {
      "time-asc": "Час ↑",
      "time-desc": "Час ↓",
      "price-asc": "Ціна ↑",
      "price-desc": "Ціна ↓",
    };
    chips.push(
      <Chip
        key="sort"
        onRemove={() =>
          onChange({ ...filters, sort: "time-asc" })
        }
      >
        Сортування: {map[filters.sort]}
      </Chip>,
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="px-4 -mx-4 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-2xl py-2">
        <div className="flex flex-wrap gap-2">{chips}</div>
      </div>
    </div>
  );
}