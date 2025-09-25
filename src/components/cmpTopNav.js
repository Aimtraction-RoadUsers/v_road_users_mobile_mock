import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage, } from "./ui/avatar";
import { Input } from "./ui/input";
import { Car, Bell } from "lucide-react";
import { useStickyHeader } from "../useStickyHeader";
import { useNavigateAction } from "../useNavigateAction";
import { useState } from "react";
export default function CMPTopNav() {
    const { hidden } = useStickyHeader();
    const { navigateToPage } = useNavigateAction();
    const [query, setQuery] = useState("");
    return (_jsx("div", { className: `fixed top-0 left-0 right-0 z-50
                  backdrop-blur supports-[backdrop-filter]:bg-background/60
                  border-b border-border transition-transform
                  ${hidden ? "-translate-y-full" : "translate-y-0"}`, style: { paddingTop: "env(safe-area-inset-top)" }, children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm", style: { height: "56px" }, children: [_jsxs(Avatar, { className: "h-10 w-10", children: [_jsx(AvatarImage, { src: "https://github.com/shadcn.png", alt: "User" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "flex-1 mx-3", children: _jsx("form", { onSubmit: (e) => {
                            e.preventDefault();
                            // Pass query as param if needed
                            navigateToPage("openSearchResults", { q: query });
                        }, children: _jsx(Input, { type: "search", placeholder: "Search...", value: query, onChange: (e) => setQuery(e.target.value), className: "w-full bg-input-background border-0 rounded-full h-9" }) }) }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("button", { className: "p-2 hover:bg-accent rounded-full transition-colors relative", style: { width: "44px", height: "44px" }, children: _jsx(Car, { className: "h-6 w-6" }) }), _jsxs("button", { className: "p-2 hover:bg-accent rounded-full transition-colors relative", style: { width: "44px", height: "44px" }, children: [_jsx(Bell, { className: "h-6 w-6" }), _jsx("div", { className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" })] })] })] }) }));
}
