import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ShortcutChip.tsx
import { Check } from "lucide-react";
import { motion } from "motion/react";
export default function CMPShortcutChip({ id, label, icon: Icon, selected = false, onClick, }) {
    return (_jsxs(motion.button, { onClick: () => onClick?.(id), whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, className: `flex flex-col items-center justify-center rounded-xl border relative p-3 transition-all`, style: { width: 160, height: 72 }, "data-selected": selected, children: [_jsx(Icon, { className: `h-6 w-6 mb-1 ${selected ? "text-blue-600" : "text-gray-900"}` }), _jsx("span", { className: `text-sm font-medium ${selected ? "text-blue-600" : "text-gray-900"}`, children: label }), selected && (_jsx(Check, { className: "h-3 w-3 text-blue-600 absolute top-2 right-2" }))] }));
}
