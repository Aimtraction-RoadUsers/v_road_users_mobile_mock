import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RotateCcw, ShoppingCart, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeResumeProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeResume: React.FC<HomeResumeProps> = ({
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
  const getActionIcon = (kind: ActionItem["kind"]) => {
    switch (kind) {
      case "ride_draft":
        return <Search className="w-4 h-4 text-blue-600" />;
      case "care_parts_pickup":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "docs_fine_pay":
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <RotateCcw className="w-4 h-4 text-gray-600" />;
    }
  };
  const getActionBgColor = (kind: ActionItem["kind"]) => {
    switch (kind) {
      case "ride_draft":
        return "bg-blue-100";
      case "care_parts_pickup":
        return "bg-green-100";
      case "docs_fine_pay":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };
  if (actions.length === 0) {
    return null;
  }
  return (
    <div className="px-4 mb-6">
      {" "}
      <h2 className="mb-4">Continue where you left off</h2>{" "}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {" "}
        {actions.map((action) => (
          <Card
            key={action.id}
            className="flex-shrink-0 w-64 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-4">
              {" "}
              <div className="flex items-start gap-3">
                {" "}
                <div
                  className={`w-8 h-8 ${getActionBgColor(action.kind)} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  {" "}
                  {getActionIcon(action.kind)}{" "}
                </div>{" "}
                <div className="flex-1 min-w-0">
                  {" "}
                  <h3 className="text-sm font-medium line-clamp-1">
                    {" "}
                    {action.title}{" "}
                  </h3>{" "}
                  {action.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {" "}
                      {action.subtitle}{" "}
                    </p>
                  )}{" "}
                  <Button
                    size="sm"
                    className="h-7 text-xs mt-3 w-full"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleActionClick(action);
                    }}
                  >
                    {" "}
                    <RotateCcw className="w-3 h-3 mr-1" />{" "}
                    {action.cta.label}{" "}
                  </Button>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
