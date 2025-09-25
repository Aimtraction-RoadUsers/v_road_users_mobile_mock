// components/CMPBottomNavRouterAdapter.tsx
import { useLocation, useNavigate } from "react-router-dom";
import CMPBottomNav, { type PageType } from "./cmpBottomNav";

const ROUTE_BY_PAGE: Record<PageType, string> = {
  home: "/",
  mobility: "/mobility",
  care: "/care",
  docs: "/docs",
  city: "/city",
};

// Який пункт підсвічувати для поточного шляху:
function pageFromPath(pathname: string): PageType {
  if (/^\/mobility(\/|$)/.test(pathname)) return "mobility";
  if (/^\/care(\/|$)/.test(pathname)) return "care";
  if (/^\/docs(\/|$)/.test(pathname)) return "docs";
  if (/^\/city(\/|$)/.test(pathname)) return "city";
  return "home";
}

export default function CMPBottomNavRouterAdapter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentPage = pageFromPath(pathname);
  const onPageChange = (page: PageType) =>
    navigate(ROUTE_BY_PAGE[page]);

  return (
    <CMPBottomNav
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
}