import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, Search, Star, MessageCircle, Clock, } from "lucide-react";
import { NavLink } from "react-router-dom";
import DoubleTapNavLink from "../cmpDoubleTapNavLink";
export default function CarpoolBottomNav() {
    const tabs = [
        {
            to: "/mobility/carpool/explore",
            icon: _jsx(Search, { className: "h-6 w-6" }),
            label: "Explore",
        },
        {
            to: "/mobility/carpool/favourite",
            icon: _jsx(Star, { className: "h-6 w-6" }),
            label: "Favourite",
        },
        {
            to: "/mobility/carpool/home",
            icon: _jsx(Home, { className: "h-6 w-6" }),
            label: "Home",
            isHome: true,
        },
        {
            to: "/mobility/carpool/chats",
            icon: _jsx(MessageCircle, { className: "h-6 w-6" }),
            label: "Chats",
        },
        {
            to: "/mobility/carpool/history",
            icon: _jsx(Clock, { className: "h-6 w-6" }),
            label: "History",
        },
    ];
    return (_jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-white shadow-md border-t flex justify-around py-2", children: tabs.map(({ to, icon, label, isHome }) => isHome ? (_jsxs(DoubleTapNavLink, { primaryTo: to, secondaryTo: "/" // подвійний тап → глобальний home
            , className: "flex flex-col items-center text-sm", children: [icon, _jsx("span", { className: "text-xs", children: label })] }, to)) : (_jsxs(NavLink, { to: to, className: ({ isActive }) => `flex flex-col items-center text-sm ${isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-500"}`, children: [icon, _jsx("span", { className: "text-xs", children: label })] }, to))) }));
}
