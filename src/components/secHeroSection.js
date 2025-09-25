import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./ui/button";
export function SECHeroSection({ onExploreClick }) {
    return (_jsxs("div", { className: "bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-4", children: [" ", _jsx("h1", { className: "mb-3", children: "Your Road, One App" }), " ", _jsxs("p", { className: "text-muted-foreground mb-6 max-w-[280px]", children: [" ", "All your trips, car care, documents, and lifestyle in one ecosystem.", " "] }), " ", _jsxs(Button, { className: "w-full h-12 rounded-xl transition-all duration-300 ease-out hover:scale-[0.98] active:scale-[0.96]", onClick: onExploreClick, children: [" ", "Explore", " "] }), " "] }));
}
