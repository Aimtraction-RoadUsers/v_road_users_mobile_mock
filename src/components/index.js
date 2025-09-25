import { jsx as _jsx } from "react/jsx-runtime";
function Home() {
    return _jsx("div", { className: "p-4", children: "Home \u00B7 Your Road, One App" });
}
function Mobility() {
    return _jsx("div", { className: "p-4", children: "Mobility screen" });
}
function Care() {
    return _jsx("div", { className: "p-4", children: "Care screen" });
}
function Docs() {
    return _jsx("div", { className: "p-4", children: "Docs & Services screen" });
}
function City() {
    return _jsx("div", { className: "p-4", children: "City & Lifestyle screen" });
}
function SearchResults() {
    return _jsx("div", { className: "p-4", children: "Search results here\u2026" });
} // Приклад повноекранного екрана (ховає TopBar)function MobilityLive() {  const { setHideTopBar } = useNav();  React.useEffect(() => {    setHideTopBar(true);    return () => setHideTopBar(false);  }, [setHideTopBar]);  return <div className="h-dvh bg-black text-white">Full-screen map / live route…</div>;}export function ScreenRegistry() {  const { view } = useNav();  switch (view) {    case "Mobility": return <Mobility />;    case "Care": return <Care />;    case "Docs": return <Docs />;    case "City": return <City />;    case "SearchResults": return <SearchResults />;    case "MobilityLive": return <MobilityLive />;    case "Home":    default: return <Home />;  }}
