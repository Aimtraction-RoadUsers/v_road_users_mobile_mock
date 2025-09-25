import { useSearchParams } from "react-router-dom";
export default function SearchResults() {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  return (
    <div className="p-4">
      {" "}
      <h1 className="font-semibold text-lg">Search</h1>{" "}
      <div className="text-sm opacity-80">query: “{q}”</div>{" "}
      {/* TODO: рендер результатів */}{" "}
    </div>
  );
}
