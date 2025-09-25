import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import CMPTopNav from "./cmpTopNav";
import CMPFloatingActionButton from "./cmpFloatingActionButton";
import CMPBottomNavRouterAdapter from "./CMPBottomNavRouterAdapter";
import CMPCarpoolBottomNav from "./cmpCarpoolBottomNav";
import { useRef } from "react";
export default function LWithTopNavLayout() {
    const { pathname } = useLocation();
    const mainRef = useRef(null);
    const HIDE_BOTTOM = ["/mobility/live", "/checkout", "/camera"];
    const HIDE_BOTTOM_PATTERNS = ["/mobility/live", "/checkout", "/camera/*"];
    const HIDE_FAB_PATTERNS = ["/mobility/live", "/checkout", "/camera/*"];
    const showBottom = !HIDE_BOTTOM_PATTERNS.some((p) => !!matchPath({ path: p, end: !p.endsWith("/*") }, pathname));
    const showFab = !HIDE_FAB_PATTERNS.some((p) => !!matchPath({ path: p, end: !p.endsWith("/*") }, pathname));
    const isCarpool = pathname.startsWith("/mobility/carpool");
    console.log("isCarpool results showed: ", isCarpool);
    return (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [" ", _jsxs("div", { className: "fixed top-0 left-0 right-0 z-50", children: [" ", _jsx(CMPTopNav, {}), " "] }), " ", _jsxs("main", { className: `flex-1 p-4 pb-24 pt-20`, children: [" ", _jsx(Outlet, {}), " "] }), " ", _jsx("div", { className: "fixed left-2 bottom-[76px] z-40 text-xs opacity-60 pointer-events-none" }), " ", " ", showBottom && !isCarpool && _jsx(CMPBottomNavRouterAdapter, {}), " ", showBottom && isCarpool && _jsx(CMPCarpoolBottomNav, {}), " ", " ", showFab && _jsx(CMPFloatingActionButton, {}), " "] }), " "] }));
}
