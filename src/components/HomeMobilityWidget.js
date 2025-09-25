import { jsx as _jsx } from "react/jsx-runtime";
import { HomeSection } from "./HomeSection";
import { Car, Search, MapPin } from "lucide-react";
export const HomeMobilityWidget = ({ actions, onActionClick, }) => {
    const quickActions = [
        {
            label: "Find ride",
            to: "/mobility/search",
            icon: _jsx(Search, { className: "w-3 h-3 mr-1" }),
        },
        {
            label: "Create ride",
            to: "/mobility/create",
            icon: _jsx(Car, { className: "w-3 h-3 mr-1" }),
        },
        {
            label: "Parking",
            to: "/mobility/parking",
            icon: _jsx(MapPin, { className: "w-3 h-3 mr-1" }),
        },
    ];
    const emptyState = {
        title: "No trips planned",
        description: "Find a ride or create your own trip to get started.",
        cta: { label: "Plan a trip", to: "/mobility/search" },
    };
    return (_jsx(HomeSection, { title: "My Trips", actions: actions, quickActions: quickActions, layout: "horizontal", maxItems: 3, emptyState: emptyState, onActionClick: onActionClick }));
};
