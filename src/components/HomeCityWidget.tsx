import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Truck,
  AlertCircle,
  Package,
  Phone,
  Map,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeCityWidgetProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeCityWidget: React.FC<HomeCityWidgetProps> = ({
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
  const bookingActions = actions.filter((a) => a.kind === "city_booking");
  const alertActions = actions.filter((a) => a.kind === "city_alert");
  const deliveryActions = actions.filter((a) => a.kind === "city_delivery");
  const getActionIcon = (
    kind: ActionItem["kind"],
    meta?: Record<string, any>,
  ) => {
    switch (kind) {
      case "city_booking":
        if (meta?.serviceId?.includes("tow")) {
          return <Truck className="w-4 h-4 text-orange-600" />;
        }
        return <MapPin className="w-4 h-4 text-blue-600" />;
      case "city_alert":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "city_delivery":
        return <Package className="w-4 h-4 text-green-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };
  const getActionBgColor = (
    kind: ActionItem["kind"],
    meta?: Record<string, any>,
  ) => {
    switch (kind) {
      case "city_booking":
        if (meta?.serviceId?.includes("tow")) {
          return "bg-orange-100";
        }
        return "bg-blue-100";
      case "city_alert":
        return "bg-red-100";
      case "city_delivery":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };
  const quickActions = [
    { label: "Map", to: "/city/map", icon: <Map className="w-3 h-3 mr-1" /> },
    {
      label: "Services",
      to: "/city/services",
      icon: <MapPin className="w-3 h-3 mr-1" />,
    },
  ];
  if (actions.length === 0) {
    return (
      <div className="px-4 mb-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <h2>City & Lifestyle</h2>{" "}
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
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />{" "}
          <h3 className="text-sm mb-1">No recent city activity</h3>{" "}
          <p className="text-xs text-muted-foreground mb-3">
            {" "}
            Find services and check road conditions.{" "}
          </p>{" "}
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/city/map")}
          >
            {" "}
            Open map{" "}
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
        <h2>City & Lifestyle</h2>{" "}
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
        {/* Live Alerts */}{" "}
        {alertActions.slice(0, 1).map((action) => (
          <Card
            key={action.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-red-200"
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-3">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div
                  className={`w-8 h-8 ${getActionBgColor(action.kind, action.meta)} rounded-lg flex items-center justify-center`}
                >
                  {" "}
                  {getActionIcon(action.kind, action.meta)}{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-sm">{action.title}</h3>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {action.subtitle}{" "}
                  </p>{" "}
                </div>{" "}
                {action.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {" "}
                    {action.badge.text}{" "}
                  </Badge>
                )}{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
        {/* Delivery Tracking */}{" "}
        {deliveryActions.slice(0, 1).map((action) => (
          <Card
            key={action.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-3">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div
                  className={`w-8 h-8 ${getActionBgColor(action.kind, action.meta)} rounded-lg flex items-center justify-center`}
                >
                  {" "}
                  {getActionIcon(action.kind, action.meta)}{" "}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-sm">{action.title}</h3>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {action.subtitle}{" "}
                  </p>{" "}
                </div>{" "}
                {action.badge && (
                  <Badge variant="outline" className="text-xs">
                    {" "}
                    {action.badge.text}{" "}
                  </Badge>
                )}{" "}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
        {/* Recent Bookings */}{" "}
        {bookingActions.slice(0, 2).map((action) => (
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
                <div className="flex items-center gap-3">
                  {" "}
                  <div
                    className={`w-6 h-6 ${getActionBgColor(action.kind, action.meta)} rounded flex items-center justify-center`}
                  >
                    {" "}
                    {getActionIcon(action.kind, action.meta)}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h3 className="text-sm">{action.title}</h3>{" "}
                    <p className="text-xs text-muted-foreground">
                      {" "}
                      {action.subtitle}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(action);
                    }}
                  >
                    {" "}
                    {action.cta.label.includes("Call") ? (
                      <Phone className="w-3 h-3 mr-1" />
                    ) : null}{" "}
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
