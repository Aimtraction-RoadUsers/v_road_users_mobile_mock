import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/mobility/pMobilityDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation, } from "react-router-dom";
import { SECDetailsPageContainer, mockCarpoolDetail, mockBusDetail, mockTrainDetail, } from "./secDetailsPageContainer";
export default function PMobilityDetail() {
    const { mode, id } = useParams();
    const [sp] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const entry = sp.get("entry") ?? "card";
    const from = sp.get("from") ?? "";
    const to = sp.get("to") ?? "";
    const whenISO = sp.get("when") ?? undefined;
    const [loading, setLoading] = useState(true);
    const [offer, setOffer] = useState(undefined);
    useEffect(() => {
        if (!mode || !id)
            return;
        setLoading(true);
        // ⚙️ тут буде реальний fetch; поки — моки
        const detail = mode === "carpool"
            ? { ...mockCarpoolDetail, id }
            : mode === "bus"
                ? { ...mockBusDetail, id }
                : { ...mockTrainDetail, id };
        // штучна затримка, якщо треба:
        // setTimeout(() => { setOffer(detail); setLoading(false); }, 150);
        setOffer(detail);
        setLoading(false);
    }, [mode, id]);
    const back = () => {
        const backTo = location.state?.backTo;
        if (backTo) {
            navigate(backTo, { replace: true }); // повертаємось саме в Results
            return;
        }
        // 2) fallback: повернутися на results із тими ж параметрами
        const qs = new URLSearchParams({
            from,
            to,
            when: whenISO ?? "",
        });
        navigate(`/mobility/results?${qs.toString()}`, {
            replace: true,
        });
    };
    if (!mode || !id) {
        navigate("/mobility", { replace: true });
        return null;
    }
    return (_jsx(SECDetailsPageContainer, { mode: mode, offer: offer, loading: loading, entryPoint: entry, onBack: back, onConfirm: (offerId) => alert("Confirm " + offerId), onContactDriver: (offerId) => alert("Contact driver " + offerId), onRedirectProvider: (offerId) => alert("Redirect to provider " + offerId) }));
}
