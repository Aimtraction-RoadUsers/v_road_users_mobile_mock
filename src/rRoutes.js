import { jsx as _jsx } from "react/jsx-runtime";
// src/router/routes.tsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";
// Layouts
import LWithTopNavLayout from "./components/lWithTopNavLayout";
import LFullscreenLayout from "./components/lFullscreenLayout";
// Pages (lazy або звичайні імпорти — як у тебе зараз)
const Home = lazy(() => import("./components/pHome"));
const PMobility = lazy(() => import("./components/pMobility"));
const PMobCarpoolResults = lazy(() => import("./components/pMobCarpoolResults"));
const PMobilityDetail = lazy(() => import("./components/pMobilityDetail"));
const Care = lazy(() => import("./components/pCare"));
const Docs = lazy(() => import("./components/pDocs"));
const City = lazy(() => import("./components/pCity"));
const SearchResults = lazy(() => import("./components/pSearchResults"));
const MobilityLive = lazy(() => import("./components/pMobilityLive"));
// Carpool
const PMobCarpoolExplore = lazy(() => import("./components/pMobCarpoolExplore"));
const PMobCarpoolFavs = lazy(() => import("./components/pMobCarpoolFavs"));
const PMobCarpoolHome = lazy(() => import("./components/PMobCarpoolHome"));
const PMobCarpoolChats = lazy(() => import("./components/pMobCarpoolChats"));
const PMobCarpoolHistory = lazy(() => import("./components/pMobCarpoolHistory"));
import { Outlet } from "react-router-dom";
/**
 * meta:
 *  - title:     зручно для breadcrumbs / <title>
 *  - resetScroll / rememberScroll: поведінка скролу (див. ScrollManager)
 */
export const routes = [
    {
        element: _jsx(LWithTopNavLayout, {}),
        children: [
            {
                path: "/",
                element: _jsx(Home, {}),
                meta: { title: "Home", resetScroll: true },
            },
            {
                path: "/mobility",
                element: _jsx(PMobility, {}),
                meta: { title: "Mobility" },
            },
            // ── ГІЛКА CARPOOL ───────────────────────────────────────────────
            {
                path: "/mobility/carpool",
                element: _jsx(Outlet, {}), // контейнер для вкладених табів
                meta: { bottom: "carpool" }, // ← ключ для підміни нижнього меню
                children: [
                    // default: редірект на explore
                    {
                        index: true,
                        element: _jsx(Navigate, { to: "explore", replace: true }),
                    },
                    {
                        path: "explore",
                        element: _jsx(PMobCarpoolExplore, {}),
                        meta: { bottom: "carpool", rememberScroll: true },
                    },
                    {
                        path: "favourite",
                        element: _jsx(PMobCarpoolFavs, {}),
                        meta: { bottom: "carpool", rememberScroll: true },
                    },
                    {
                        path: "home",
                        element: _jsx(PMobCarpoolHome, {}),
                        meta: { bottom: "carpool" },
                    },
                    {
                        path: "chats",
                        element: _jsx(PMobCarpoolChats, {}),
                        meta: { bottom: "carpool", rememberScroll: true },
                    },
                    {
                        path: "history",
                        element: _jsx(PMobCarpoolHistory, {}),
                        meta: { bottom: "carpool", rememberScroll: true },
                    },
                    // results/detail теж у гілці карпула
                    {
                        path: "results",
                        element: _jsx(PMobCarpoolResults, {}),
                        meta: { bottom: "carpool", rememberScroll: true },
                    },
                    {
                        path: "detail/:mode/:id",
                        element: _jsx(PMobilityDetail, {}),
                        meta: { bottom: "carpool", resetScroll: true },
                    },
                ],
            },
            {
                path: "/mobility/carpool/results",
                element: _jsx(PMobCarpoolResults, {}),
                meta: { title: "Results", rememberScroll: true },
            },
            {
                path: "/mobility/detail/:mode/:id",
                element: _jsx(PMobilityDetail, {}),
                meta: { title: "Detail", resetScroll: true },
            },
            {
                path: "/care",
                element: _jsx(Care, {}),
                meta: { title: "Care" },
            },
            {
                path: "/docs",
                element: _jsx(Docs, {}),
                meta: { title: "Docs" },
            },
            {
                path: "/city",
                element: _jsx(City, {}),
                meta: { title: "City" },
            },
            {
                path: "/search",
                element: _jsx(SearchResults, {}),
                meta: { title: "Search" },
            },
        ],
    },
    {
        element: _jsx(LFullscreenLayout, {}),
        children: [
            {
                path: "/mobility/live",
                element: _jsx(MobilityLive, {}),
                meta: { title: "Live", resetScroll: true },
            },
        ],
    },
];
