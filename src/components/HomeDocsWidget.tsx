import React from "react";
import { type ActionItem } from "../types/ActionItem";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Shield,
  AlertTriangle,
  FileText,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HomeDocsWidgetProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}
export const HomeDocsWidget: React.FC<HomeDocsWidgetProps> = ({
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
  const insuranceActions = actions.filter(
    (a) => a.kind === "docs_insurance_renew",
  );
  const fineActions = actions.filter((a) => a.kind === "docs_fine_pay");
  const tollActions = actions.filter((a) => a.kind === "docs_toll_permit");
  const licenseActions = actions.filter(
    (a) => a.kind === "docs_license_expiry",
  );
  const getActionIcon = (kind: ActionItem["kind"]) => {
    switch (kind) {
      case "docs_insurance_renew":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "docs_fine_pay":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "docs_toll_permit":
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case "docs_license_expiry":
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };
  const getActionBgColor = (kind: ActionItem["kind"]) => {
    switch (kind) {
      case "docs_insurance_renew":
        return "bg-blue-100";
      case "docs_fine_pay":
        return "bg-red-100";
      case "docs_toll_permit":
        return "bg-green-100";
      case "docs_license_expiry":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };
  if (actions.length === 0) {
    return (
      <div className="px-4 mb-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <h2>Documents & Services</h2>{" "}
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/docs")}
            className="h-8"
          >
            {" "}
            <FileText className="w-3 h-3 mr-1" /> View all{" "}
          </Button>{" "}
        </div>{" "}
        <Card className="p-4">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              {" "}
              <Shield className="w-4 h-4 text-green-600" />{" "}
            </div>{" "}
            <div className="flex-1">
              {" "}
              <h3 className="text-sm">All documents up to date</h3>{" "}
              <p className="text-xs text-muted-foreground">
                {" "}
                No renewals or payments needed{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </Card>{" "}
      </div>
    );
  }
  return (
    <div className="px-4 mb-6">
      {" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <h2>Documents & Services</h2>{" "}
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/docs")}
          className="h-8"
        >
          {" "}
          <FileText className="w-3 h-3 mr-1" /> View all{" "}
        </Button>{" "}
      </div>{" "}
      {/* Safety strip - critical items */}{" "}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {" "}
        {fineActions.slice(0, 2).map((action) => (
          <Card
            key={action.id}
            className="flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow border-red-200"
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-3">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <div
                  className={`w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`}
                >
                  {" "}
                  {getActionIcon(action.kind)}{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs font-medium">Traffic fine</p>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {action.meta?.amount
                      ? `₴${action.meta.amount}`
                      : "Pay now"}{" "}
                  </p>{" "}
                </div>{" "}
                {action.badge && (
                  <Badge variant="destructive" className="text-xs ml-2">
                    {" "}
                    {action.badge.text}{" "}
                  </Badge>
                )}{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
        {tollActions.slice(0, 1).map((action) => (
          <Card
            key={action.id}
            className="flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActionClick(action)}
          >
            {" "}
            <CardContent className="p-3">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <div
                  className={`w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`}
                >
                  {" "}
                  {getActionIcon(action.kind)}{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs font-medium">Toll permit</p>{" "}
                  <p className="text-xs text-muted-foreground">
                    Today's route
                  </p>{" "}
                </div>{" "}
                {action.badge && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {" "}
                    {action.badge.text}{" "}
                  </Badge>
                )}{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      {/* Regular document items */}{" "}
      <div className="space-y-2">
        {" "}
        {insuranceActions.slice(0, 1).map((action) => (
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
                    className={`w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`}
                  >
                    {" "}
                    {getActionIcon(action.kind)}{" "}
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
                  {action.badge && (
                    <Badge variant="outline" className="text-xs">
                      {" "}
                      {action.badge.text}{" "}
                    </Badge>
                  )}{" "}
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
        {licenseActions.slice(0, 1).map((action) => (
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
                    className={`w-6 h-6 ${getActionBgColor(action.kind)} rounded flex items-center justify-center`}
                  >
                    {" "}
                    {getActionIcon(action.kind)}{" "}
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
                  {action.badge && (
                    <Badge variant="outline" className="text-xs">
                      {" "}
                      {action.badge.text}{" "}
                    </Badge>
                  )}{" "}
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
