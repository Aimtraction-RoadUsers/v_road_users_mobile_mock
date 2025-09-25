import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronRight, Clock, AlertTriangle, CheckCircle, Calendar, } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const HomeNextUp = ({ actions, onActionClick, }) => {
    const navigate = useNavigate();
    const handleActionClick = (action) => {
        if (onActionClick) {
            onActionClick(action);
        }
        navigate(action.cta.to);
    };
    const handleSecondaryAction = (action, e) => {
        e.stopPropagation();
        navigate(action.to);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "overdue":
                return _jsx(AlertTriangle, { className: "w-4 h-4 text-destructive" });
            case "todo":
                return _jsx(Clock, { className: "w-4 h-4 text-orange-500" });
            case "soon":
                return _jsx(Calendar, { className: "w-4 h-4 text-blue-500" });
            case "done":
                return _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
            default:
                return _jsx(Clock, { className: "w-4 h-4 text-muted-foreground" });
        }
    };
    const getBadgeVariant = (variant) => {
        switch (variant) {
            case "destructive":
                return "destructive";
            case "warning":
                return "outline";
            case "success":
                return "secondary";
            default:
                return "default";
        }
    };
    if (actions.length === 0) {
        return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsx("h2", { className: "mb-4", children: "Next up" }), " ", _jsxs(Card, { className: "p-6 text-center", children: [" ", _jsx(CheckCircle, { className: "w-12 h-12 text-green-500 mx-auto mb-3" }), " ", _jsx("h3", { className: "mb-2", children: "All caught up!" }), " ", _jsxs("p", { className: "text-sm text-muted-foreground", children: [" ", "No urgent actions needed right now.", " "] }), " "] }), " "] }));
    }
    return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsx("h2", { className: "mb-4", children: "Next up" }), " ", _jsxs("div", { className: "space-y-3", children: [" ", actions.map((action, index) => (_jsxs(Card, { className: `cursor-pointer transition-all hover:shadow-md ${index === 0 ? "border-primary/20 bg-primary/5" : ""}`, onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-start gap-3", children: [" ", _jsxs("div", { className: "flex-shrink-0 mt-1", children: [" ", getStatusIcon(action.status), " "] }), " ", _jsxs("div", { className: "flex-1 min-w-0", children: [" ", _jsxs("div", { className: "flex items-start justify-between mb-2", children: [" ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "truncate", children: action.title }), " ", action.subtitle && (_jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [" ", action.subtitle, " "] })), " "] }), " ", action.badge && (_jsxs(Badge, { variant: getBadgeVariant(action.badge.variant), className: "ml-2 flex-shrink-0", children: [" ", action.badge.text, " "] })), " "] }), " ", _jsxs("div", { className: "flex items-center justify-between", children: [" ", _jsxs(Button, { size: "sm", variant: action.cta.variant || "default", className: "h-8", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleActionClick(action);
                                                                }, children: [" ", action.cta.label, " "] }), " ", action.secondary && action.secondary.length > 0 && (_jsxs("div", { className: "flex gap-2", children: [" ", action.secondary.slice(0, 2).map((secondary, idx) => (_jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 text-xs", onClick: (e) => handleSecondaryAction(secondary, e), children: [" ", secondary.label, " "] }, idx))), " "] })), " "] }), " "] }), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" }), " "] }), " "] }), " "] }, action.id))), " "] }), " "] }));
};
