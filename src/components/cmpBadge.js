import { jsx as _jsx } from "react/jsx-runtime";
import { motion, useAnimationControls, AnimatePresence, } from "framer-motion";
import { useEffect } from "react";
const posClasses = {
    "top-right": "top-1 right-1",
    "top-left": "top-1 left-1",
    "bottom-right": "bottom-1 right-1",
    "bottom-left": "bottom-1 left-1",
};
export default function CMPBadge({ count, max = 99, position = "top-right", className = "", }) {
    // не рендеримо, якщо 0, null або undefined
    // 🔹 Hide badge if 0 or less
    if (!count || count <= 0)
        return null;
    const controls = useAnimationControls();
    const display = count > max ? `${max}+` : String(count);
    // Bump-анімація щоразу, коли змінюється count
    useEffect(() => {
        controls.start({
            scale: [1, 1.15, 1],
            transition: {
                type: "spring",
                stiffness: 600,
                damping: 24,
            },
        });
    }, [count, controls]);
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0, y: -4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4, scale: 0.95 }, transition: {
                type: "spring",
                stiffness: 500,
                damping: 28,
            }, "aria-label": `Непрочитані: ${display}`, className: [
                "absolute z-20", // ✅ always on top,
                posClasses[position],
                "bg-red-500 text-white text-xs font-bold",
                "rounded-full min-w-[1.25rem] h-5 px-1",
                "flex items-center justify-center",
                "shadow-sm select-none",
                className,
            ].join(" "), children: display }, "badge") }));
}
