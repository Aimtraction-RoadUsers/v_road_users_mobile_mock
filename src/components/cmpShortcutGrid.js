import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ShortcutGrid.tsx
import CMPShortcutChip from "./cmpShortcutChip";
export default function CMPShortcutGrid({ items, activeId, onSelect, }) {
    return (_jsx("div", { className: "grid grid-cols-2 gap-4 justify-items-center", children: items.map((item) => (_jsx(CMPShortcutChip, { id: item.id, label: item.label, icon: item.icon, selected: activeId === item.id, onClick: onSelect }, item.id))) }));
}
