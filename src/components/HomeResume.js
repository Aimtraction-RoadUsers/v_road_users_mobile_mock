import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RotateCcw, ShoppingCart, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const HomeResume = ({ actions, onActionClick, }) => {
    const navigate = useNavigate();
    const handleActionClick = (action) => {
        if (onActionClick) {
            onActionClick(action);
        }
        navigate(action.cta.to);
    };
    const getActionIcon = (kind) => {
        switch (kind) {
            case "ride_draft":
                return _jsx(Search, { className: "w-4 h-4 text-blue-600" });
            case "care_parts_pickup":
                return _jsx(ShoppingCart, { className: "w-4 h-4 text-green-600" });
            case "docs_fine_pay":
                return _jsx(FileText, { className: "w-4 h-4 text-red-600" });
            default:
                return _jsx(RotateCcw, { className: "w-4 h-4 text-gray-600" });
        }
    };
    const getActionBgColor = (kind) => {
        switch (kind) {
            case "ride_draft":
                return "bg-blue-100";
            case "care_parts_pickup":
                return "bg-green-100";
            case "docs_fine_pay":
                return "bg-red-100";
            default:
                return "bg-gray-100";
        }
    };
    if (actions.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsx("h2", { className: "mb-4", children: "Continue where you left off" }), " ", _jsxs("div", { className: "flex gap-3 overflow-x-auto pb-2", children: [" ", actions.map((action) => (_jsxs(Card, { className: "flex-shrink-0 w-64 cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-start gap-3", children: [" ", _jsxs("div", { className: `w-8 h-8 ${getActionBgColor(action.kind)} rounded-lg flex items-center justify-center flex-shrink-0`, children: [" ", getActionIcon(action.kind), " "] }), " ", _jsxs("div", { className: "flex-1 min-w-0", children: [" ", _jsxs("h3", { className: "text-sm font-medium line-clamp-1", children: [" ", action.title, " "] }), " ", action.subtitle && (_jsxs("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-1", children: [" ", action.subtitle, " "] })), " ", _jsxs(Button, { size: "sm", className: "h-7 text-xs mt-3 w-full", onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleActionClick(action);
                                                        }, children: [" ", _jsx(RotateCcw, { className: "w-3 h-3 mr-1" }), " ", action.cta.label, " "] }), " "] }), " "] }), " "] }), " "] }, action.id))), " "] }), " "] }));
};
