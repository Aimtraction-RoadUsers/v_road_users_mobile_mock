import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/mobility/pMobilitySearch.tsx
import { useNavigate } from "react-router-dom";
import { CMPSECGONow } from "./cmpSECGONow";
export function PMobilitySearch() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "max-w-md mx-auto px-4 py-4", children: _jsx(CMPSECGONow, { onChooseShare: (from, to, whenISO) => {
                const qs = new URLSearchParams({
                    from,
                    to,
                    when: whenISO ?? "",
                });
                navigate(`/mobility/carpool/results?${qs.toString()}`);
            } }) }));
}
