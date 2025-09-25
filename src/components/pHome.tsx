import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Car,
  Plus,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import action types and services
import {
  
  type ActionItem,
  selectNextUp,
  selectByDomain,
  selectResume,
} from "../types/ActionItem";
import { actionItemService } from "../services/ActionItemService";

// Import widgets
import { HomeNextUp } from "./HomeNextUp";
import { HomeMobilityWidget } from "./HomeMobilityWidget";
import { HomeCareWidget } from "./HomeCareWidget";
import { HomeDocsWidget } from "./HomeDocsWidget";
import { HomeCityWidget } from "./HomeCityWidget";
import { HomeResume } from "./HomeResume";


const PHome: React.FC = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const allActions =
        await actionItemService.getAllActions();
      setActions(allActions);
      setError(null);
    } catch (err) {
      setError("Failed to load actions");
      console.error("Error loading actions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (action: ActionItem) => {
    // Track action clicks for personalization
    console.log("Action clicked:", action.id, action.kind);

    // Mark as completed if it's a completion action
    if (
      action.kind === "ride_rate" ||
      action.kind === "docs_fine_pay"
    ) {
      try {
        await actionItemService.markActionComplete(action.id);
        // Refresh actions
        loadActions();
      } catch (err) {
        console.error("Error marking action complete:", err);
      }
    }
  };

  // Calculate contextual FAB action
  const getContextualFAB = () => {
    const nextActions = selectNextUp(actions);

    if (nextActions.length > 0) {
      const primary = nextActions[0];
      switch (primary.domain) {
        case "mobility":
          return {
            label: "Find ride",
            to: "/mobility/search",
            icon: Car,
          };
        case "care":
          return {
            label: "Book service",
            to: "/care/book",
            icon: Car,
          };
        case "docs":
          return {
            label: "Pay fine",
            to: "/docs/fines/pay",
            icon: Car,
          };
        default:
          return {
            label: "Create trip",
            to: "/mobility",
            icon: Plus,
          };
      }
    }

    return {
      label: "Create trip",
      to: "/mobility",
      icon: Plus,
    };
  };

  const contextualFAB = getContextualFAB();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 bg-white border-b border-border z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="flex-1 mx-4 h-9" />
              <div className="flex gap-2">
                <Skeleton className="w-9 h-9" />
                <Skeleton className="w-9 h-9" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeletons */}
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadActions}>Try again</Button>
        </div>
      </div>
    );
  }

  const nextUpActions = selectNextUp(actions);
  const mobilityActions = selectByDomain(actions, "mobility");
  const careActions = selectByDomain(actions, "care");
  const docsActions = selectByDomain(actions, "docs");
  const cityActions = selectByDomain(actions, "city");
  const resumeActions = selectResume(actions);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar 
      <div className="sticky top-0 bg-white border-b border-border z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            // Left - Avatar
            <Avatar
              className="w-8 h-8 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            //Center - Search
            <div className="flex-1 mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes, services..."
                  className="pl-10 h-9 bg-muted border-0"
                  onClick={() => navigate("/mobility")}
                  readOnly
                />
              </div>
            </div>
            //Right - Car and Notifications
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => navigate("/care")}
              >
                <Car className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 relative"
                onClick={() => navigate("/docs")}
              >
                <Bell className="w-5 h-5" />
                {nextUpActions.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs"
                  >
                    {nextUpActions.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
     */}
      {/* Main Content */}
      <div className="pb-20">
        {/* Next Up Section */}
        <HomeNextUp
          actions={nextUpActions}
          onActionClick={handleActionClick}
        />

        {/* My Trips (Mobility) */}
        <HomeMobilityWidget
          actions={mobilityActions}
          onActionClick={handleActionClick}
        />

        {/* Current Repair (Vehicle Care) */}
        <HomeCareWidget
          actions={careActions}
          onActionClick={handleActionClick}
        />

        {/* Documents & Services */}
        <HomeDocsWidget
          actions={docsActions}
          onActionClick={handleActionClick}
        />

        {/* City & Lifestyle */}
        <HomeCityWidget
          actions={cityActions}
          onActionClick={handleActionClick}
        />

        {/* Resume Section */}
        <HomeResume
          actions={resumeActions}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Contextual FAB */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => navigate(contextualFAB.to)}
        >
          <contextualFAB.icon className="w-6 h-6" />
        </Button>
      </div>

      {/* Messages shortcut */}
      <div className="fixed bottom-20 left-4 z-40">
        <Button
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-white"
          onClick={() => navigate("/mobility/carpool/chats")}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default PHome;