import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Car, Plus, MessageCircle, } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import action types and services
import { selectNextUp, selectByDomain, selectResume, } from "../types/ActionItem";
import { actionItemService } from "../services/ActionItemService";
// Import widgets
import { HomeNextUp } from "./HomeNextUp";
import { HomeMobilityWidget } from "./HomeMobilityWidget";
import { HomeCareWidget } from "./HomeCareWidget";
import { HomeDocsWidget } from "./HomeDocsWidget";
import { HomeCityWidget } from "./HomeCityWidget";
import { HomeResume } from "./HomeResume";
const PHome = () => {
    const navigate = useNavigate();
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        loadActions();
    }, []);
    const loadActions = async () => {
        try {
            setLoading(true);
            const allActions = await actionItemService.getAllActions();
            setActions(allActions);
            setError(null);
        }
        catch (err) {
            setError("Failed to load actions");
            console.error("Error loading actions:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleActionClick = async (action) => {
        // Track action clicks for personalization
        console.log("Action clicked:", action.id, action.kind);
        // Mark as completed if it's a completion action
        if (action.kind === "ride_rate" ||
            action.kind === "docs_fine_pay") {
            try {
                await actionItemService.markActionComplete(action.id);
                // Refresh actions
                loadActions();
            }
            catch (err) {
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
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "sticky top-0 bg-white border-b border-border z-50", children: _jsx("div", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { className: "w-8 h-8 rounded-full" }), _jsx(Skeleton, { className: "flex-1 mx-4 h-9" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { className: "w-9 h-9" }), _jsx(Skeleton, { className: "w-9 h-9" })] })] }) }) }), _jsxs("div", { className: "px-4 py-6 space-y-6", children: [_jsx(Skeleton, { className: "h-32 w-full" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-6 w-24" }), _jsx(Skeleton, { className: "h-20 w-full" }), _jsx(Skeleton, { className: "h-20 w-full" })] })] })] }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-4", children: error }), _jsx(Button, { onClick: loadActions, children: "Try again" })] }) }));
    }
    const nextUpActions = selectNextUp(actions);
    const mobilityActions = selectByDomain(actions, "mobility");
    const careActions = selectByDomain(actions, "care");
    const docsActions = selectByDomain(actions, "docs");
    const cityActions = selectByDomain(actions, "city");
    const resumeActions = selectResume(actions);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "pb-20", children: [_jsx(HomeNextUp, { actions: nextUpActions, onActionClick: handleActionClick }), _jsx(HomeMobilityWidget, { actions: mobilityActions, onActionClick: handleActionClick }), _jsx(HomeCareWidget, { actions: careActions, onActionClick: handleActionClick }), _jsx(HomeDocsWidget, { actions: docsActions, onActionClick: handleActionClick }), _jsx(HomeCityWidget, { actions: cityActions, onActionClick: handleActionClick }), _jsx(HomeResume, { actions: resumeActions, onActionClick: handleActionClick })] }), _jsx("div", { className: "fixed bottom-20 right-4 z-40", children: _jsx(Button, { size: "lg", className: "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow", onClick: () => navigate(contextualFAB.to), children: _jsx(contextualFAB.icon, { className: "w-6 h-6" }) }) }), _jsx("div", { className: "fixed bottom-20 left-4 z-40", children: _jsx(Button, { variant: "outline", size: "lg", className: "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-white", onClick: () => navigate("/mobility/carpool/chats"), children: _jsx(MessageCircle, { className: "w-6 h-6" }) }) })] }));
};
export default PHome;
