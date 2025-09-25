import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Car, Wrench, FileText, Building, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
export function CMPCategoryCards() {
    const categories = [
        {
            id: "mobility",
            icon: Car,
            title: "🚘 Mobility",
            description: "Find rides, share trips, book scooters or rentals.",
        },
        {
            id: "care",
            icon: Wrench,
            title: "🔧 Care",
            description: "Keep your car healthy with vStatus, repairs, and spare parts.",
        },
        {
            id: "docs",
            icon: FileText,
            title: "📄 Docs & Services",
            description: "All insurance, fines, tolls, and documents in one place.",
        },
        {
            id: "city",
            icon: Building,
            title: "🏙️ City & Lifestyle",
            description: "Discover city services, deliveries, schools, and live road info.",
        },
    ];
    return (_jsxs("div", { className: "space-y-3 mb-6", children: [" ", categories.map((category) => {
                const Icon = category.icon;
                return (_jsxs(Card, { className: "p-4 border border-border", children: [" ", _jsxs("div", { className: "flex items-start justify-between", children: [" ", _jsxs("div", { className: "flex-1", children: [" ", _jsxs("div", { className: "flex items-center mb-2", children: [" ", _jsx(Icon, { className: "h-8 w-8 text-muted-foreground mr-3" }), " ", _jsx("h3", { className: "text-lg", children: category.title }), " "] }), " ", _jsxs("p", { className: "text-muted-foreground mb-3 leading-relaxed", children: [" ", category.description, " "] }), " ", _jsxs("button", { className: "flex items-center text-primary hover:underline", children: [" ", _jsx("span", { children: "Find out more" }), " ", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" }), " "] }), " "] }), " "] }), " "] }, category.id));
            }), " "] }));
}
