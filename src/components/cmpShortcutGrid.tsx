// src/components/ShortcutGrid.tsx
import CMPShortcutChip from "./cmpShortcutChip";
import type { ShortcutChipItem } from "./types_ui";

type Props = {
  items: ShortcutChipItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export default function CMPShortcutGrid({
  items,
  activeId,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center">
      {items.map((item) => (
        <CMPShortcutChip
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          selected={activeId === item.id}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}