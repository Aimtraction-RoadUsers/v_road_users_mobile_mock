import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Wrench, Calendar, Package, Gauge, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeCareWidgetProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeCareWidget: React.FC<HomeCareWidgetProps> = ({
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
  const serviceActions = actions.filter((a) => a.kind === "care_appointment");
  const partsActions = actions.filter((a) => a.kind === "care_parts_pickup");
  const motActions = actions.filter(
    (a) => a.kind === "care_service_due" || a.kind === "care_mot_due",
  );
  const quickActions = [
    {
      label: "Book service",
      to: "/care/book",
      icon: <Wrench className="w-3 h-3 mr-1" />,
    },
    {
      label: "Buy parts",
      to: "/care/parts",
      icon: <Package className="w-3 h-3 mr-1" />,
    },
  ];
  if (actions.length === 0) {
    return (
      <div className="px-4 mb-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <h2>Vehicle Care</h2>{" "}
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
          </div>{" "}
        </div>{" "}
        <Card className="p-4 text-center">
          {" "}
          <Wrench className="w-8 h-8 text-muted-foreground mx-auto mb-2" />{" "}
          <h3 className="text-sm mb-1">All systems running smoothly</h3>{" "}
          <p className="text-xs text-muted-foreground mb-3">
            {" "}
            No maintenance needed right now.{" "}
          </p>{" "}
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/care/book")}
          >
            {" "}
            Book diagnostic{" "}
          </Button>{" "}
        </Card>{" "}
      </div>
    );
  }
  return (
    <div className="px-4 mb-6">
      {" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <h2>Vehicle Care</h2>{" "}
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
        </div>{" "}
      </div>{" "}
      <div className="space-y-3">
        {" "}
        {/* Service Appointments */}{" "}
        {serviceActions.length > 0 && (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(serviceActions[0])}
          >
            {" "}
            <CardContent className="p-4">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {" "}
                  <Calendar className="w-4 h-4 text-blue-600" />{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-sm">{serviceActions[0].title}</h3>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {serviceActions[0].subtitle}{" "}
                  </p>{" "}
                </div>{" "}
                {serviceActions[0].badge && (
                  <Badge variant="outline" className="text-xs">
                    {" "}
                    {serviceActions[0].badge.text}{" "}
                  </Badge>
                )}{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        )}{" "}
        {/* Parts Pickup */}{" "}
        {partsActions.length > 0 && (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(partsActions[0])}
          >
            {" "}
            <CardContent className="p-4">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  {" "}
                  <Package className="w-4 h-4 text-green-600" />{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-sm">{partsActions[0].title}</h3>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {partsActions[0].subtitle}{" "}
                  </p>{" "}
                </div>{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        )}{" "}
        {/* MOT/Service Due */}{" "}
        {motActions.length > 0 && (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(motActions[0])}
          >
            {" "}
            <CardContent className="p-4">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  {" "}
                  <Gauge className="w-4 h-4 text-orange-600" />{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-sm">{motActions[0].title}</h3>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {motActions[0].subtitle}{" "}
                  </p>{" "}
                </div>{" "}
                {motActions[0].badge && (
                  <Badge variant="outline" className="text-xs">
                    {" "}
                    {motActions[0].badge.text}{" "}
                  </Badge>
                )}{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        )}{" "}
      </div>{" "}
    </div>
  );
};
