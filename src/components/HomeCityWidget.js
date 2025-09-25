import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Truck, AlertCircle, Package, Phone, Map, ChevronRight, } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const HomeCityWidget = ({ actions, onActionClick, }) => {
    const navigate = useNavigate();
    const handleActionClick = (action) => {
        if (onActionClick) {
            onActionClick(action);
        }
        navigate(action.cta.to);
    };
    const bookingActions = actions.filter((a) => a.kind === "city_booking");
    const alertActions = actions.filter((a) => a.kind === "city_alert");
    const deliveryActions = actions.filter((a) => a.kind === "city_delivery");
    const getActionIcon = (kind, meta) => {
        switch (kind) {
            case "city_booking":
                if (meta?.serviceId?.includes("tow")) {
                    return _jsx(Truck, { className: "w-4 h-4 text-orange-600" });
                }
                return _jsx(MapPin, { className: "w-4 h-4 text-blue-600" });
            case "city_alert":
                return _jsx(AlertCircle, { className: "w-4 h-4 text-red-600" });
            case "city_delivery":
                return _jsx(Package, { className: "w-4 h-4 text-green-600" });
            default:
                return _jsx(MapPin, { className: "w-4 h-4 text-gray-600" });
        }
    };
    const getActionBgColor = (kind, meta) => {
        switch (kind) {
            case "city_booking":
                if (meta?.serviceId?.includes("tow")) {
                    return "bg-orange-100";
                }
                return "bg-blue-100";
            case "city_alert":
                return "bg-red-100";
            case "city_delivery":
                return "bg-green-100";
            default:
                return "bg-gray-100";
        }
    };
    const quickActions = [
        { label: "Map", to: "/city/map", icon: _jsx(Map, { className: "w-3 h-3 mr-1" }) },
        {
            label: "Services",
            to: "/city/services",
            icon: _jsx(MapPin, { className: "w-3 h-3 mr-1" }),
        },
    ];
    if (actions.length === 0) {
        return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "City & Lifestyle" }), " ", _jsxs("div", { className: "flex gap-2", children: [" ", quickActions.map((action, index) => (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate(action.to), className: "h-8", children: [" ", action.icon, " ", action.label, " "] }, index))), " "] }), " "] }), " ", _jsxs(Card, { className: "p-4 text-center", children: [" ", _jsx(MapPin, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }), " ", _jsx("h3", { className: "text-sm mb-1", children: "No recent city activity" }), " ", _jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [" ", "Find services and check road conditions.", " "] }), " ", _jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate("/city/map"), children: [" ", "Open map", " "] }), " "] }), " "] }));
    }
    return (_jsxs("div", { className: "px-4 mb-6", children: [" ", _jsxs("div", { className: "flex items-center justify-between mb-4", children: [" ", _jsx("h2", { children: "City & Lifestyle" }), " ", _jsxs("div", { className: "flex gap-2", children: [" ", quickActions.map((action, index) => (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => navigate(action.to), className: "h-8", children: [" ", action.icon, " ", action.label, " "] }, index))), " "] }), " "] }), " ", _jsxs("div", { className: "space-y-3", children: [" ", " ", alertActions.slice(0, 1).map((action) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow border-red-200", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: `w-8 h-8 ${getActionBgColor(action.kind, action.meta)} rounded-lg flex items-center justify-center`, children: [" ", getActionIcon(action.kind, action.meta), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: action.title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.subtitle, " "] }), " "] }), " ", action.badge && (_jsxs(Badge, { variant: "destructive", className: "text-xs", children: [" ", action.badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), " "] }), " "] }), " "] }, action.id))), " ", " ", deliveryActions.slice(0, 1).map((action) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: `w-8 h-8 ${getActionBgColor(action.kind, action.meta)} rounded-lg flex items-center justify-center`, children: [" ", getActionIcon(action.kind, action.meta), " "] }), " ", _jsxs("div", { className: "flex-1", children: [" ", _jsx("h3", { className: "text-sm", children: action.title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.subtitle, " "] }), " "] }), " ", action.badge && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [" ", action.badge.text, " "] })), " ", _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), " "] }), " "] }), " "] }, action.id))), " ", " ", bookingActions.slice(0, 2).map((action) => (_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleActionClick(action), children: [" ", _jsxs(CardContent, { className: "p-3", children: [" ", _jsxs("div", { className: "flex items-center justify-between", children: [" ", _jsxs("div", { className: "flex items-center gap-3", children: [" ", _jsxs("div", { className: `w-6 h-6 ${getActionBgColor(action.kind, action.meta)} rounded flex items-center justify-center`, children: [" ", getActionIcon(action.kind, action.meta), " "] }), " ", _jsxs("div", { children: [" ", _jsx("h3", { className: "text-sm", children: action.title }), " ", _jsxs("p", { className: "text-xs text-muted-foreground", children: [" ", action.subtitle, " "] }), " "] }), " "] }), " ", _jsxs("div", { className: "flex items-center gap-2", children: [" ", _jsxs(Button, { size: "sm", variant: "outline", className: "h-6 text-xs", onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleActionClick(action);
                                                        }, children: [" ", action.cta.label.includes("Call") ? (_jsx(Phone, { className: "w-3 h-3 mr-1" })) : null, " ", action.cta.label, " "] }), " "] }), " "] }), " "] }), " "] }, action.id))), " "] }), " "] }));
};
