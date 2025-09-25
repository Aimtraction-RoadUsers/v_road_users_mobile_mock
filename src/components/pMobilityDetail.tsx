// src/pages/mobility/pMobilityDetail.tsx
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  SECDetailsPageContainer,
  type DetailOffer,
  mockCarpoolDetail,
  mockBusDetail,
  mockTrainDetail,
} from "./secDetailsPageContainer";

type Mode = "carpool" | "bus" | "train";

export default function PMobilityDetail() {
  const { mode, id } = useParams<{ mode: Mode; id: string }>();
  const [sp] = useSearchParams();

  const location = useLocation();
  const navigate = useNavigate();

  const entry =
    (sp.get("entry") as "card" | "primaryCta") ?? "card";
  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const whenISO = sp.get("when") ?? undefined;

  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState<DetailOffer | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!mode || !id) return;
    setLoading(true);
    // ⚙️ тут буде реальний fetch; поки — моки
    const detail =
      mode === "carpool"
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
    const backTo = (location.state as any)?.backTo as
      | string
      | undefined;
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

  return (
    <SECDetailsPageContainer
      mode={mode}
      offer={offer}
      loading={loading}
      entryPoint={entry}
      onBack={back}
      onConfirm={(offerId) => alert("Confirm " + offerId)}
      onContactDriver={(offerId) =>
        alert("Contact driver " + offerId)
      }
      onRedirectProvider={(offerId) =>
        alert("Redirect to provider " + offerId)
      }
    />
  );
}