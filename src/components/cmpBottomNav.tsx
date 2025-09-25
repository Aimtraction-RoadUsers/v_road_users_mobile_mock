import { Car, Wrench, Home, FileText, Building } from "lucide-react";
export type PageType = "home" | "mobility" | "care" | "docs" | "city";
export interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}
export default function CMPBottomNav({
  currentPage,
  onPageChange,
}: BottomNavProps) {
  const navItems = [
    { id: "mobility" as PageType, label: "Mobility", icon: Car },
    { id: "care" as PageType, label: "Care", icon: Wrench },
    { id: "home" as PageType, label: "Home", icon: Home },
    { id: "docs" as PageType, label: "Docs", icon: FileText },
    { id: "city" as PageType, label: "City", icon: Building },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border"
      style={{ height: "64px" }}
    >
      {" "}
      <div className="flex items-center justify-around h-full">
        {" "}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${isActive ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
            >
              {" "}
              <Icon className="h-5 w-5 mb-1" />{" "}
              <span className="text-xs">{item.label}</span>{" "}
            </button>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
}
