import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Car, MapPin, AlertTriangle, Map, ShoppingBag } from "lucide-react";
export function SECQuickActions() {
    const actions = [
        { id: "book-ride", label: "Book Ride", icon: Car },
        { id: "my-car", label: "My Car", icon: MapPin },
        { id: "pay-fine", label: "Pay Fine", icon: AlertTriangle },
        { id: "city-map", label: "City Map", icon: Map },
        { id: "shop-parts", label: "Shop Parts", icon: ShoppingBag },
    ];
    return (_jsxs("div", { className: "mb-6", children: [" ", _jsx("h3", { className: "mb-4", children: "Quick Actions" }), " ", _jsxs("div", { className: "flex justify-between items-center", children: [" ", actions.map((action) => {
                        const Icon = action.icon;
                        return (_jsxs("button", { className: "flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors", children: [" ", _jsxs("div", { className: "bg-primary/10 p-3 rounded-full mb-2", children: [" ", _jsx(Icon, { className: "h-7 w-7 text-primary" }), " "] }), " ", _jsxs("span", { className: "text-xs text-center leading-tight max-w-16", children: [" ", action.label, " "] }), " "] }, action.id));
                    }), " "] }), " "] }));
}
