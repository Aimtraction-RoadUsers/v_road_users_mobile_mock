import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/pMobility.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { CMPSECGONow } from "../components/cmpSECGONow";
import { SECResultsPageContainer } from "../components/secResultsPageContainer";
export default function PMobility() {
    const [sp] = useSearchParams();
    const from = sp.get("from");
    const to = sp.get("to");
    const when = sp.get("when");
    const navigate = useNavigate();
    // 🔑 це викликає CMPSECGONow, коли юзер обирає "Підсадка"
    // 🔑 викликає CMPSECGONow, коли юзер обирає "Підсадка"
    const handleChooseShare = (from, to, whenISO) => {
        const search = new URLSearchParams({ from, to });
        if (whenISO)
            search.set("when", whenISO);
        navigate(`/mobility/carpool/results?${search.toString()}`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [_jsx(CMPSECGONow, { onStartDrive: (dst) => console.log("Drive to:", dst), onChooseShare: handleChooseShare, onChooseTaxi: (dst) => console.log("Taxi to:", dst), onChooseScooter: (dst) => console.log("Scooter to:", dst), onOpenParking: (near) => console.log("Parking near:", near) }), sp.get("showResults") === "true" && (_jsx(SECResultsPageContainer, { onBack: () => navigate(-1) }))] }));
}
