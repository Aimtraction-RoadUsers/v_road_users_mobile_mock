import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, AlertTriangle, FileText, CreditCard, ChevronRight, } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const HomeDocsWidget = ({ actions, onActionClick, }) => {
    const navigate = useNavigate();
    const handleActionClick = (action) => {
        if (onActionClick) {
            onActionClick(action);
        }
        navigate(action.cta.to);
    };
    const insuranceActions = actions.filter((a) => a.kind === "docs_insurance_renew");
    const fineActions = actions.filter((a) => a.kind === "docs_fine_pay");
    const tollActions = actions.filter((a) => a.kind === "docs_toll_permit");
    const licenseActions = actions.filter((a) => a.kind === "docs_license_expiry");
    const getActionIcon = (kind) => {
        switch (kind) {
            case "docs_insurance_renew":
                return _jsx(Shield, { className: "w-4 h-4 text-blue-600" });
            case "docs_fine_pay":
                return _jsx(AlertTriangle, { className: "w-4 h-4 text-red-600" });
            case "docs_toll_permit":
                return _jsx(CreditCard, { className: "w-4 h-4 text-green-600" });
            case "docs_license_expiry":
                return _jsx(FileText, { className: "w-4 h-4 text-orange-600" });
            default:
                return _jsx(FileText, { className: "w-4 h-4 text-gray-600" });
        }
    };
    const getActionBgColor = (kind) => {
        switch (kind) {
            case "docs_insurance_renew":
                return "bg-blue-100";
            case "docs_fine_pay":
                return "bg-red-100";
            case "docs_toll_permit":
                return "bg-green-100";
            case "docs_license_expiry":
                return "bg-orange-100";
            default:
                return "bg-gray-100";
        }
    };
    if (actions.length === 0) {
        return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "Documents & Services" }), " ", _jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate("/docs"), className: "h-8", children: [" ", _jsx(FileText, { className: "w-3 h-3 mr-1" }), " View all", " "] }), " "] }), " ", _jsxs(Card, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: [" ", _jsx(Shield, { className: "w-4 h-4 text-green-600" }), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: "All documents up to date" }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", "No renewals or payments needed", " "] }), " "] }), " "] }), " "] }), " "] }));
    }
    return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "Documents & Services" }), " ", _jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate("/docs"), className: "h-8", children: [" ", _jsx(FileText, { className: "w-3 h-3 mr-1" }), " View all", " "] }), " "] }), " ", " ", _jsxs("div", { className: "flex gap-2 mb-3 overflow-x-auto pb-2", children: [" ", fineActions.slice(0, 2).map((action) => (_jsxs(Card, { className: "flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow border-red-200", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center gap-2", children: [" ", _jsxs("div", { className: `w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`, children: [" ", getActionIcon(action.kind), " "] }), " ", _jsxs("div", { children: [" ", _jsx("p", { className: "text-xs font-medium", children: "Traffic fine" }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.meta?.amount
                                                                ? `₴${action.meta.amount}`
                                                                : "Pay now", " "] }), " "] }), " ", action.badge && (_jsxs(Badge, { variant: "destructive", className: "text-xs ml-2", children: [" ", action.badge.text, " "] })), " "] }), " "] }), " "] }, action.id))), " ", tollActions.slice(0, 1).map((action) => (_jsxs(Card, { className: "flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center gap-2", children: [" ", _jsxs("div", { className: `w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`, children: [" ", getActionIcon(action.kind), " "] }), " ", _jsxs("div", { children: [" ", _jsx("p", { className: "text-xs font-medium", children: "Toll permit" }), " ", _jsx("p", { className: "text-xs text-muted-foreground", children: "Today's route" }), " "] }), " ", action.badge && (_jsxs(Badge, { variant: "outline", className: "text-xs ml-2", children: [" ", action.badge.text, " "] })), " "] }), " "] }), " "] }, action.id))), " "] }), " ", " ", _jsxs("div", { className: "space-y-2", children: [" ", insuranceActions.slice(0, 1).map((action) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center justify-between", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: `w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`, children: [" ", getActionIcon(action.kind), " "] }), " ", _jsxs("div", { children: [" ", _jsx("h3", { className: "text-sm", children: action.title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.subtitle, " "] }), " "] }), " "] }), " ", _jsxs("div", { className: "flex items-center gap-2", children: [" ", action.badge && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [" ", action.badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }), " "] }), " "] }), " "] }), " "] }, action.id))), " ", licenseActions.slice(0, 1).map((action) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center justify-between", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: `w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`, children: [" ", getActionIcon(action.kind), " "] }), " ", _jsxs("div", { children: [" ", _jsx("h3", { className: "text-sm", children: action.title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.subtitle, " "] }), " "] }), " "] }), " ", _jsxs("div", { className: "flex items-center gap-2", children: [" ", action.badge && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [" ", action.badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }), " "] }), " "] }), " "] }), " "] }, action.id))), " "] }), " "] }));
};
