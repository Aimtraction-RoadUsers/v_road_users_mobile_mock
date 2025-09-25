import { Button } from "./ui/button";
interface HeroSectionProps {
  onExploreClick: () => void;
}
export function SECHeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-4">
      {" "}
      <h1 className="mb-3">Your Road, One App</h1>{" "}
      <p className="text-muted-foreground mb-6 max-w-[280px]">
        {" "}
        All your trips, car care, documents, and lifestyle in one
        ecosystem.{" "}
      </p>{" "}
      <Button
        className="w-full h-12 rounded-xl transition-all duration-300 ease-out hover:scale-[0.98] active:scale-[0.96]"
        onClick={onExploreClick}
      >
        {" "}
        Explore{" "}
      </Button>{" "}
    </div>
  );
}
