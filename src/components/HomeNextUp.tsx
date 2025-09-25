import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeNextUpProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeNextUp: React.FC<HomeNextUpProps> = ({
  actions,
  onActionClick,
}) => {
  const navigate = useNavigate();
  const handleActionClick = (action: ActionItem) => {
    if (onActionClick) {
      onActionClick(action);
    }
    navigate(action.cta.to);
  };
  const handleSecondaryAction = (
    action: { label: string; to: string },
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    navigate(action.to);
  };
  const getStatusIcon = (status: ActionItem["status"]) => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "todo":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "soon":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };
  const getBadgeVariant = (
    variant: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "warning":
        return "outline";
      case "success":
        return "secondary";
      default:
        return "default";
    }
  };
  if (actions.length === 0) {
    return (
      <div className="px-4 mb-6">
        {" "}
        <h2 className="mb-4">Next up</h2>{" "}
        <Card className="p-6 text-center">
          {" "}
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />{" "}
          <h3 className="mb-2">All caught up!</h3>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            No urgent actions needed right now.{" "}
          </p>{" "}
        </Card>{" "}
      </div>
    );
  }
  return (
    <div className="px-4 mb-6">
      {" "}
      <h2 className="mb-4">Next up</h2>{" "}
      <div className="space-y-3">
        {" "}
        {actions.map((action, index) => (
          <Card
            key={action.id}
            className={`cursor-pointer transition-all hover:shadow-md ${index === 0 ? "border-primary/20 bg-primary/5" : ""}`}
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-4">
              {" "}
              <div className="flex items-start gap-3">
                {" "}
                <div className="flex-shrink-0 mt-1">
                  {" "}
                  {getStatusIcon(action.status)}{" "}
                </div>{" "}
                <div className="flex-1 min-w-0">
                  {" "}
                  <div className="flex items-start justify-between mb-2">
                    {" "}
                    <div className="flex-1">
                      {" "}
                      <h3 className="truncate">{action.title}</h3>{" "}
                      {action.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {" "}
                          {action.subtitle}{" "}
                        </p>
                      )}{" "}
                    </div>{" "}
                    {action.badge && (
                      <Badge
                        variant={getBadgeVariant(action.badge.variant)}
                        className="ml-2 flex-shrink-0"
                      >
                        {" "}
                        {action.badge.text}{" "}
                      </Badge>
                    )}{" "}
                  </div>{" "}
                  <div className="flex items-center justify-between">
                    {" "}
                    <Button
                      size="sm"
                      variant={action.cta.variant || "default"}
                      className="h-8"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleActionClick(action);
                      }}
                    >
                      {" "}
                      {action.cta.label}{" "}
                    </Button>{" "}
                    {action.secondary && action.secondary.length > 0 && (
                      <div className="flex gap-2">
                        {" "}
                        {action.secondary.slice(0, 2).map((secondary, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handleSecondaryAction(secondary, e)
                            }
                          >
                            {" "}
                            {secondary.label}{" "}
                          </Button>
                        ))}{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
