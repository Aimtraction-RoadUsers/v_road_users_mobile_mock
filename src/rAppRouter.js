import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/router/AppRouter.tsx
import { Suspense } from "react";
import { BrowserRouter as Router, // лишаємо твій поточний варіант
useRoutes, } from "react-router-dom";
import { routes } from "./rRoutes";
import { ScrollManager } from "./rScrollManager";
function RoutesRenderer() {
    return useRoutes(routes);
}
export default function AppRouter() {
    return (_jsxs(Router, { initialEntries: ["/"], children: [_jsx(ScrollManager, {}), _jsx(Suspense, { fallback: null, children: _jsx(RoutesRenderer, {}) })] }));
}
