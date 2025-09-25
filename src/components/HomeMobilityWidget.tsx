import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { HomeSection } from "./HomeSection";
import { Car, Search, MapPin } from "lucide-react";
interface HomeMobilityWidgetProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeMobilityWidget: React.FC<HomeMobilityWidgetProps> = ({
  actions,
  onActionClick,
}) => {
  const quickActions = [
    {
      label: "Find ride",
      to: "/mobility/search",
      icon: <Search className="w-3 h-3 mr-1" />,
    },
    {
      label: "Create ride",
      to: "/mobility/create",
      icon: <Car className="w-3 h-3 mr-1" />,
    },
    {
      label: "Parking",
      to: "/mobility/parking",
      icon: <MapPin className="w-3 h-3 mr-1" />,
    },
  ];
  const emptyState = {
    title: "No trips planned",
    description: "Find a ride or create your own trip to get started.",
    cta: { label: "Plan a trip", to: "/mobility/search" },
  };
  return (
    <HomeSection
      title="My Trips"
      actions={actions}
      quickActions={quickActions}
      layout="horizontal"
      maxItems={3}
      emptyState={emptyState}
      onActionClick={onActionClick}
    />
  );
};
