import { Car, MapPin, AlertTriangle, Map, ShoppingBag } from "lucide-react";
export function SECQuickActions() {
  const actions = [
    { id: "book-ride", label: "Book Ride", icon: Car },
    { id: "my-car", label: "My Car", icon: MapPin },
    { id: "pay-fine", label: "Pay Fine", icon: AlertTriangle },
    { id: "city-map", label: "City Map", icon: Map },
    { id: "shop-parts", label: "Shop Parts", icon: ShoppingBag },
  ];
  return (
    <div className="mb-6">
      {" "}
      <h3 className="mb-4">Quick Actions</h3>{" "}
      <div className="flex justify-between items-center">
        {" "}
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {" "}
              <div className="bg-primary/10 p-3 rounded-full mb-2">
                {" "}
                <Icon className="h-7 w-7 text-primary" />{" "}
              </div>{" "}
              <span className="text-xs text-center leading-tight max-w-16">
                {" "}
                {action.label}{" "}
              </span>{" "}
            </button>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
}
