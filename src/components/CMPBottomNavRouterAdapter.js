import { jsx as _jsx } from "react/jsx-runtime";
// components/CMPBottomNavRouterAdapter.tsx
import { useLocation, useNavigate } from "react-router-dom";
import CMPBottomNav from "./cmpBottomNav";
const ROUTE_BY_PAGE = {
    home: "/",
    mobility: "/mobility",
    care: "/care",
    docs: "/docs",
    city: "/city",
};
// Який пункт підсвічувати для поточного шляху:
function pageFromPath(pathname) {
    if (/^\/mobility(\/|$)/.test(pathname))
        return "mobility";
    if (/^\/care(\/|$)/.test(pathname))
        return "care";
    if (/^\/docs(\/|$)/.test(pathname))
        return "docs";
    if (/^\/city(\/|$)/.test(pathname))
        return "city";
    return "home";
}
export default function CMPBottomNavRouterAdapter() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const currentPage = pageFromPath(pathname);
    const onPageChange = (page) => navigate(ROUTE_BY_PAGE[page]);
    return (_jsx(CMPBottomNav, { currentPage: currentPage, onPageChange: onPageChange }));
}
