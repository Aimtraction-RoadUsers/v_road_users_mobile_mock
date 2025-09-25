import { Outlet, useLocation, matchPath } from "react-router-dom";
import CMPTopNav from "./cmpTopNav";
import CMPFloatingActionButton from "./cmpFloatingActionButton";
import CMPBottomNavRouterAdapter from "./CMPBottomNavRouterAdapter";
import CMPCarpoolBottomNav from "./cmpCarpoolBottomNav";

export default function LWithTopNavLayout() {
  const { pathname } = useLocation();
  const HIDE_BOTTOM_PATTERNS = ["/mobility/live", "/checkout", "/camera/*"];
  const HIDE_FAB_PATTERNS = ["/mobility/live", "/checkout", "/camera/*"];
  const showBottom = !HIDE_BOTTOM_PATTERNS.some(
    (p) => !!matchPath({ path: p, end: !p.endsWith("/*") }, pathname),
  );
  const showFab = !HIDE_FAB_PATTERNS.some(
    (p) => !!matchPath({ path: p, end: !p.endsWith("/*") }, pathname),
  );
  const isCarpool = pathname.startsWith("/mobility/carpool");
  console.log("isCarpool results showed: ", isCarpool);
  return (
    <>
      {" "}
      <div className="min-h-screen bg-background flex flex-col">
        {" "}
        <div className="fixed top-0 left-0 right-0 z-50">
          {" "}
          <CMPTopNav />{" "}
        </div>{" "}
        <main className={`flex-1 p-4 pb-24 pt-20`}>
          {" "}
          <Outlet />{" "}
        </main>{" "}
        <div className="fixed left-2 bottom-[76px] z-40 text-xs opacity-60 pointer-events-none"></div>{" "}
        {/* нижнє меню */}{" "}
        {showBottom && !isCarpool && <CMPBottomNavRouterAdapter />}{" "}
        {showBottom && isCarpool && <CMPCarpoolBottomNav />} {/* FAB */}{" "}
        {showFab && <CMPFloatingActionButton />}{" "}
      </div>{" "}
    </>
  );
}
