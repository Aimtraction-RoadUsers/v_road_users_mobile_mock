import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeSectionProps {
  title: string;
  actions: ActionItem[];
  quickActions?: { label: string; to: string; icon?: React.ReactNode }[];
  maxItems?: number;
  layout?: "horizontal" | "vertical";
  emptyState?: {
    title: string;
    description: string;
    cta?: { label: string; to: string };
  };
  onActionClick?: (action: ActionItem) => void;
}
export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  actions,
  quickActions,
  maxItems = 3,
  layout = "horizontal",
  emptyState,
  onActionClick,
}) => {
  const navigate = useNavigate();
  const handleActionClick = (action: ActionItem) => {
    if (onActionClick) {
      onActionClick(action);
    }
    navigate(action.cta.to);
  };
  const displayActions = actions.slice(0, maxItems);
  if (actions.length === 0 && emptyState) {
    return (
      <div className="px-4 mb-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <h2>{title}</h2>{" "}
          {quickActions && quickActions.length > 0 && (
            <div className="flex gap-2">
              {" "}
              {quickActions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(action.to)}
                  className="h-8"
                >
                  {" "}
                  {action.icon} {action.label}{" "}
                </Button>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
        <Card className="p-6 text-center">
          {" "}
          <h3 className="mb-2">{emptyState.title}</h3>{" "}
          <p className="text-sm text-muted-foreground mb-4">
            {" "}
            {emptyState.description}{" "}
          </p>{" "}
          {emptyState.cta && (
            <Button size="sm" onClick={() => navigate(emptyState.cta!.to)}>
              {" "}
              <Plus className="w-4 h-4 mr-2" /> {emptyState.cta.label}{" "}
            </Button>
          )}{" "}
        </Card>{" "}
      </div>
    );
  }
  return (
    <div className="px-4 mb-6">
      {" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <h2>{title}</h2>{" "}
        {quickActions && quickActions.length > 0 && (
          <div className="flex gap-2">
            {" "}
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => navigate(action.to)}
                className="h-8"
              >
                {" "}
                {action.icon} {action.label}{" "}
              </Button>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
      {layout === "horizontal" ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {" "}
          {displayActions.map((action) => (
            <Card
              key={action.id}
              className="flex-shrink-0 w-72 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleActionClick(action)}
            >
              {" "}
              <CardContent className="p-4">
                {" "}
                <div className="flex items-start justify-between mb-3">
                  {" "}
                  <div className="flex-1">
                    {" "}
                    <h3 className="text-sm line-clamp-1">
                      {action.title}
                    </h3>{" "}
                    {action.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {" "}
                        {action.subtitle}{" "}
                      </p>
                    )}{" "}
                  </div>{" "}
                  {action.badge && (
                    <Badge variant="outline" className="text-xs ml-2">
                      {" "}
                      {action.badge.text}{" "}
                    </Badge>
                  )}{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <Button size="sm" className="h-7 text-xs">
                    {" "}
                    {action.cta.label}{" "}
                  </Button>{" "}
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>
      ) : (
        <div className="space-y-2">
          {" "}
          {displayActions.map((action) => (
            <Card
              key={action.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleActionClick(action)}
            >
              {" "}
              <CardContent className="p-3">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="flex-1">
                    {" "}
                    <h3 className="text-sm">{action.title}</h3>{" "}
                    {action.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {" "}
                        {action.subtitle}{" "}
                      </p>
                    )}{" "}
                  </div>{" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    {action.badge && (
                      <Badge variant="outline" className="text-xs">
                        {" "}
                        {action.badge.text}{" "}
                      </Badge>
                    )}{" "}
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      {" "}
                      {action.cta.label}{" "}
                    </Button>{" "}
                  </div>{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>
      )}{" "}
      {actions.length > maxItems && (
        <div className="mt-3 text-center">
          {" "}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${actions[0].domain}`)}
          >
            {" "}
            View all ({actions.length}){" "}
          </Button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
