// src/pages/pMobility.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { CMPSECGONow } from "../components/cmpSECGONow";
import { SECResultsPageContainer } from "../components/secResultsPageContainer";


export default function PMobility() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 🔑 це викликає CMPSECGONow, коли юзер обирає "Підсадка"
  // 🔑 викликає CMPSECGONow, коли юзер обирає "Підсадка"
  const handleChooseShare = (
    from: string,
    to: string,
    whenISO?: string,
  ) => {
    const search = new URLSearchParams({ from, to });
    if (whenISO) search.set("when", whenISO);
    navigate(`/mobility/carpool/results?${search.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CMPSECGONow
        onStartDrive={(dst) => console.log("Drive to:", dst)}
        onChooseShare={handleChooseShare}
        onChooseTaxi={(dst) => console.log("Taxi to:", dst)}
        onChooseScooter={(dst) =>
          console.log("Scooter to:", dst)
        }
        onOpenParking={(near) =>
          console.log("Parking near:", near)
        }
      />

      {/* цей контейнер показується вже на /mobility/results */}
      {sp.get("showResults") === "true" && (
        <SECResultsPageContainer onBack={() => navigate(-1)} />
      )}
    </div>
  );
}