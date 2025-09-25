// src/router/AppRouter.tsx
import { Suspense } from "react";
import {
  BrowserRouter as Router, // лишаємо твій поточний варіант
  useRoutes,
} from "react-router-dom";
import { routes } from "./rRoutes";
import { ScrollManager } from "./rScrollManager";

function RoutesRenderer() {
  return useRoutes(routes as any);
}

export default function AppRouter() {
  return (
    <Router>
      <ScrollManager />
      <Suspense fallback={null}>
        <RoutesRenderer />
      </Suspense>
    </Router>
  );
}