import { Car, Wrench, FileText, Building, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
export function CMPCategoryCards() {
  const categories = [
    {
      id: "mobility",
      icon: Car,
      title: "🚘 Mobility",
      description: "Find rides, share trips, book scooters or rentals.",
    },
    {
      id: "care",
      icon: Wrench,
      title: "🔧 Care",
      description:
        "Keep your car healthy with vStatus, repairs, and spare parts.",
    },
    {
      id: "docs",
      icon: FileText,
      title: "📄 Docs & Services",
      description: "All insurance, fines, tolls, and documents in one place.",
    },
    {
      id: "city",
      icon: Building,
      title: "🏙️ City & Lifestyle",
      description:
        "Discover city services, deliveries, schools, and live road info.",
    },
  ];
  return (
    <div className="space-y-3 mb-6">
      {" "}
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.id} className="p-4 border border-border">
            {" "}
            <div className="flex items-start justify-between">
              {" "}
              <div className="flex-1">
                {" "}
                <div className="flex items-center mb-2">
                  {" "}
                  <Icon className="h-8 w-8 text-muted-foreground mr-3" />{" "}
                  <h3 className="text-lg">{category.title}</h3>{" "}
                </div>{" "}
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {" "}
                  {category.description}{" "}
                </p>{" "}
                <button className="flex items-center text-primary hover:underline">
                  {" "}
                  <span>Find out more</span>{" "}
                  <ChevronRight className="h-4 w-4 ml-1" />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </Card>
        );
      })}{" "}
    </div>
  );
}
