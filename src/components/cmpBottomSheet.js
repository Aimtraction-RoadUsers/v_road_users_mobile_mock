import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/BottomSheet.tsx
import { AnimatePresence, motion } from "motion/react";
export default function CMPBottomSheet({ open, onClose, title = "Sheet", children, }) {
    return (_jsx(AnimatePresence, { children: open && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/40 z-40", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }), _jsx(motion.div, { className: "fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl bg-white p-4 shadow-2xl", initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" }, transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                    }, children: _jsxs("div", { className: "mx-auto max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: title }), _jsx("button", { className: "px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200", onClick: onClose, children: "Close" })] }), children] }) })] })) }));
}
