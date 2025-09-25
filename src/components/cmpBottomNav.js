import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Car, Wrench, Home, FileText, Building } from "lucide-react";
export default function CMPBottomNav({ currentPage, onPageChange, }) {
    const navItems = [
        { id: "mobility", label: "Mobility", icon: Car },
        { id: "care", label: "Care", icon: Wrench },
        { id: "home", label: "Home", icon: Home },
        { id: "docs", label: "Docs", icon: FileText },
        { id: "city", label: "City", icon: Building },
    ];
    return (_jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-background border-t border-border", style: { height: "64px" }, children: [" ", _jsxs("div", { className: "flex items-center justify-around h-full", children: [" ", navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (_jsxs("button", { onClick: () => onPageChange(item.id), className: `flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${isActive ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`, children: [" ", _jsx(Icon, { className: "h-5 w-5 mb-1" }), " ", _jsx("span", { className: "text-xs", children: item.label }), " "] }, item.id));
                    }), " "] }), " "] }));
}
