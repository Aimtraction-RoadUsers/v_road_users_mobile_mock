// src/router/routes.tsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Layouts
import LWithTopNavLayout from "./components/lWithTopNavLayout";
import LFullscreenLayout from "./components/lFullscreenLayout";

// Pages (lazy або звичайні імпорти — як у тебе зараз)
const Home = lazy(() => import("./components/pHome"));
const PMobility = lazy(() => import("./components/pMobility"));
const PMobCarpoolResults = lazy(
  () => import("./components/pMobCarpoolResults"),
);

const PMobilityDetail = lazy(
  () => import("./components/pMobilityDetail"),
);
const Care = lazy(() => import("./components/pCare"));
const Docs = lazy(() => import("./components/pDocs"));
const City = lazy(() => import("./components/pCity"));
const SearchResults = lazy(
  () => import("./components/pSearchResults"),
);
const MobilityLive = lazy(
  () => import("./components/pMobilityLive"),
);

// Carpool
const PMobCarpoolExplore = lazy(
  () => import("./components/pMobCarpoolExplore"),
);
const PMobCarpoolFavs = lazy(
  () => import("./components/pMobCarpoolFavs"),
);
const PMobCarpoolHome = lazy(
  () => import("./components/PMobCarpoolHome"),
);
const PMobCarpoolChats = lazy(
  () => import("./components/pMobCarpoolChats"),
);
const PMobCarpoolHistory = lazy(
  () => import("./components/pMobCarpoolHistory"),
);

import { Outlet } from "react-router-dom";

/**
 * meta:
 *  - title:     зручно для breadcrumbs / <title>
 *  - resetScroll / rememberScroll: поведінка скролу (див. ScrollManager)
 */
export const routes = [
  {
    element: <LWithTopNavLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        meta: { title: "Home", resetScroll: true },
      },
      {
        path: "/mobility",
        element: <PMobility />,
        meta: { title: "Mobility" },
      },
      // ── ГІЛКА CARPOOL ───────────────────────────────────────────────
      {
        path: "/mobility/carpool",
        element: <Outlet />, // контейнер для вкладених табів
        meta: { bottom: "carpool" }, // ← ключ для підміни нижнього меню
        children: [
          // default: редірект на explore
          {
            index: true,
            element: <Navigate to="explore" replace />,
          },

          {
            path: "explore",
            element: <PMobCarpoolExplore />,
            meta: { bottom: "carpool", rememberScroll: true },
          },
          {
            path: "favourite",
            element: <PMobCarpoolFavs />,
            meta: { bottom: "carpool", rememberScroll: true },
          },
          {
            path: "home",
            element: <PMobCarpoolHome />,
            meta: { bottom: "carpool" },
          },
          {
            path: "chats",
            element: <PMobCarpoolChats />,
            meta: { bottom: "carpool", rememberScroll: true },
          },
          {
            path: "history",
            element: <PMobCarpoolHistory />,
            meta: { bottom: "carpool", rememberScroll: true },
          },

          // results/detail теж у гілці карпула
          {
            path: "results",
            element: <PMobCarpoolResults />,
            meta: { bottom: "carpool", rememberScroll: true },
          },
          {
            path: "detail/:mode/:id",
            element: <PMobilityDetail />,
            meta: { bottom: "carpool", resetScroll: true },
          },
        ],
      },

      {
        path: "/mobility/carpool/results",
        element: <PMobCarpoolResults />,
        meta: { title: "Results", rememberScroll: true },
      },
      {
        path: "/mobility/detail/:mode/:id",
        element: <PMobilityDetail />,
        meta: { title: "Detail", resetScroll: true },
      },
      {
        path: "/care",
        element: <Care />,
        meta: { title: "Care" },
      },
      {
        path: "/docs",
        element: <Docs />,
        meta: { title: "Docs" },
      },
      {
        path: "/city",
        element: <City />,
        meta: { title: "City" },
      },
      {
        path: "/search",
        element: <SearchResults />,
        meta: { title: "Search" },
      },
    ],
  },
  {
    element: <LFullscreenLayout />,
    children: [
      {
        path: "/mobility/live",
        element: <MobilityLive />,
        meta: { title: "Live", resetScroll: true },
      },
    ],
  },
] as const;