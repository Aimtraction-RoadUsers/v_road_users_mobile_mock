import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from "react-router-dom";
export default function SearchResults() {
    const [sp] = useSearchParams();
    const q = sp.get("q") || "";
    return (_jsxs("div", { className: "p-4", children: [" ", _jsx("h1", { className: "font-semibold text-lg", children: "Search" }), " ", _jsxs("div", { className: "text-sm opacity-80", children: ["query: \u201C", q, "\u201D"] }), " ", " "] }));
}
