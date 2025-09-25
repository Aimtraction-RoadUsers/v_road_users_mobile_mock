import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Plus, X, Car, AlertTriangle, Wrench, Shield, ShoppingCart, Ellipsis, MoreHorizontal, ParkingSquare, } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CMPBottomSheet from "./cmpBottomSheet";
import CMPShortcutGrid from "./cmpShortcutGrid";
import CMPBadge from "./cmpBadge";
export default function CMPFloatingActionButton({ onRunShortcut, actions = [
    {
        id: "vPidsadka",
        label: "vPidsadka",
        icon: Car,
        colorClass: "bg-blue-500",
    },
    {
        id: "fines",
        label: "Fines",
        icon: AlertTriangle,
        colorClass: "bg-red-500",
    },
    {
        id: "repair",
        label: "Repair",
        icon: Wrench,
        colorClass: "bg-orange-500",
    },
    {
        id: "insurance",
        label: "Insurance",
        icon: Shield,
        colorClass: "bg-green-500",
    },
    {
        id: "shopping",
        label: "Shopping",
        icon: ShoppingCart,
        colorClass: "bg-purple-500",
    },
    {
        id: "more",
        label: "More",
        icon: MoreHorizontal,
        colorClass: "bg-gray-800",
    }, // opens sheet
], shortcuts = [
    { id: "fines", label: "Fines", icon: AlertTriangle },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "repair", label: "Repair", icon: Wrench },
    { id: "parking", label: "Parking", icon: ParkingSquare },
], }) {
    const [isDialOpen, setIsDialOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [activeChip, setActiveChip] = useState(null);
    const [pending, setPending] = useState(0); // badge number
    const actionButtons = [
        {
            id: "vPidsadka",
            label: "vPidsadka",
            icon: Car,
            color: "bg-blue-500",
        },
        {
            id: "vInformer",
            label: "Informer",
            icon: AlertTriangle,
            color: "bg-red-500",
        },
        {
            id: "repair",
            label: "Repair",
            icon: Wrench,
            color: "bg-orange-500",
        },
        {
            id: "cart",
            label: "Cart",
            icon: ShoppingCart,
            color: "bg-purple-500",
        },
        {
            id: "more",
            label: "...More",
            icon: Ellipsis,
            color: "bg-black",
        },
    ];
    const handleActionClick = (actionId) => {
        if (actionId === "more") {
            console.log(`Clicked: ${actionId === "more"}`);
            setIsDialOpen(false);
            setIsSheetOpen(true);
            return;
        }
        // handle other quick actions here
        setIsDialOpen(false);
    };
    const handleChipSelect = (chipId) => {
        setActiveChip(chipId);
        onRunShortcut?.(chipId); // parent callback for navigation
    };
    // ESC closes sheet
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setIsSheetOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
    return (_jsxs("div", { children: [_jsx(CMPBottomSheet, { open: isSheetOpen, onClose: () => setIsSheetOpen(false), title: "Shortcuts", children: _jsx(CMPShortcutGrid, { items: shortcuts, activeId: activeChip, onSelect: handleChipSelect }) }), _jsxs("div", { className: "fixed bottom-20 right-4 z-50", children: [_jsx(AnimatePresence, { children: isDialOpen && (_jsx("div", { className: "flex flex-col items-end space-y-3 mb-4", children: actionButtons.map((action, index) => {
                                const Icon = action.icon;
                                return (_jsxs(motion.button, { initial: { opacity: 0, scale: 0, y: 20 }, animate: {
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        transition: { delay: index * 0.1 },
                                    }, exit: {
                                        opacity: 0,
                                        scale: 0,
                                        y: 20,
                                        transition: {
                                            delay: (actionButtons.length - index - 1) *
                                                0.05,
                                        },
                                    }, onClick: () => handleActionClick(action.id), className: `${action.color} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow flex items-center`, children: [_jsx("span", { className: "mr-3 text-sm whitespace-nowrap bg-white text-gray-800 px-2 py-1 rounded", children: action.label }), _jsx(Icon, { className: "h-5 w-5" })] }, action.id));
                            }) })) }), _jsxs(motion.button, { onClick: () => {
                            setIsDialOpen(!isDialOpen);
                            setPending((n) => n + 1); // ⬅️ bump the number
                        }, className: "bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, animate: { rotate: isDialOpen ? 45 : 0 }, children: [isDialOpen ? (_jsx(X, { className: "h-6 w-6" })) : (_jsx(Plus, { className: "h-6 w-6" })), _jsx(CMPBadge, { count: pending, max: 99, position: "top-right" })] })] })] }));
}
