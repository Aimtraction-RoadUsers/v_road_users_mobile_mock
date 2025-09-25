import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Wrench, Calendar, Package, Gauge, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const HomeCareWidget = ({ actions, onActionClick, }) => {
    const navigate = useNavigate();
    const handleActionClick = (action) => {
        if (onActionClick) {
            onActionClick(action);
        }
        navigate(action.cta.to);
    };
    const serviceActions = actions.filter((a) => a.kind === "care_appointment");
    const partsActions = actions.filter((a) => a.kind === "care_parts_pickup");
    const motActions = actions.filter((a) => a.kind === "care_service_due" || a.kind === "care_mot_due");
    const quickActions = [
        {
            label: "Book service",
            to: "/care/book",
            icon: _jsx(Wrench, { className: "w-3 h-3 mr-1" }),
        },
        {
            label: "Buy parts",
            to: "/care/parts",
            icon: _jsx(Package, { className: "w-3 h-3 mr-1" }),
        },
    ];
    if (actions.length === 0) {
        return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "Vehicle Care" }), " ", _jsxs("div", { className: "flex gap-2", children: [" ", quickActions.map((action, index) => (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate(action.to), className: "h-8", children: [" ", action.icon, " ", action.label, " "] }, index))), " "] }), " "] }), " ", _jsxs(Card, { className: "p-4 text-center", children: [" ", _jsx(Wrench, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }), " ", _jsx("h3", { className: "text-sm mb-1", children: "All systems running smoothly" }), " ", _jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [" ", "No maintenance needed right now.", " "] }), " ", _jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate("/care/book"), children: [" ", "Book diagnostic", " "] }), " "] }), " "] }));
    }
    return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "Vehicle Care" }), " ", _jsxs("div", { className: "flex gap-2", children: [" ", quickActions.map((action, index) => (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate(action.to), className: "h-8", children: [" ", action.icon, " ", action.label, " "] }, index))), " "] }), " "] }), " ", _jsxs("div", { className: "space-y-3", children: [" ", " ", serviceActions.length > 0 && (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(serviceActions[0]), children: [" ", _jsxs(CardContent, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: [" ", _jsx(Calendar, { className: "w-4 h-4 text-blue-600" }), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: serviceActions[0].title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", serviceActions[0].subtitle, " "] }), " "] }), " ", serviceActions[0].badge && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [" ", serviceActions[0].badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), " "] }), " "] }), " "] })), " ", " ", partsActions.length > 0 && (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(partsActions[0]), children: [" ", _jsxs(CardContent, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: [" ", _jsx(Package, { className: "w-4 h-4 text-green-600" }), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: partsActions[0].title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", partsActions[0].subtitle, " "] }), " "] }), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), " "] }), " "] }), " "] })), " ", " ", motActions.length > 0 && (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(motActions[0]), children: [" ", _jsxs(CardContent, { className: "p-4", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: "w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center", children: [" ", _jsx(Gauge, { className: "w-4 h-4 text-orange-600" }), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: motActions[0].title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", motActions[0].subtitle, " "] }), " "] }), " ", motActions[0].badge && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [" ", motActions[0].badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), " "] }), " "] }), " "] })), " "] }), " "] }));
};
