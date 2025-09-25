import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, MoreHorizontal, Search, Car, MessageCircle, Route, Star, Clock, Users, Shield, Phone, Navigation, Edit3, CheckCircle, Wifi, } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage, } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { useNavigate } from "react-router-dom";
const PMobCarpoolHome = () => {
    const navigate = useNavigate();
    const [walkWithMeEnabled, setWalkWithMeEnabled] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [loading, setLoading] = useState(true);
    // Mock data
    const [passengerTrips] = useState([
        {
            id: "1",
            from: "Lviv",
            to: "Kyiv",
            date: "2025-01-20",
            time: "14:30",
            driver: {
                name: "Oleksandr M.",
                avatar: "",
                rating: 4.8,
                verified: true,
            },
            seat: 2,
            price: 350,
            bookingCode: "ABC123",
            status: "CONFIRMED",
        },
    ]);
    const [driverOffers] = useState([
        {
            id: "1",
            from: "Kyiv",
            to: "Odesa",
            date: "2025-01-22",
            time: "09:00",
            seatsLeft: 2,
            totalSeats: 4,
            requestsPending: 3,
            pricePerSeat: 400,
            autoConfirm: true,
            status: "PUBLISHED",
        },
    ]);
    const [savedRoutes] = useState([
        {
            id: "1",
            title: "Lviv→Kyiv Fri 18:00",
            from: "Lviv",
            to: "Kyiv",
            preferredTime: "18:00",
            role: "PASSENGER",
        },
        {
            id: "2",
            title: "Kyiv→Odesa Sat 09:00",
            from: "Kyiv",
            to: "Odesa",
            preferredTime: "09:00",
            role: "DRIVER",
        },
    ]);
    const [suggestedMatches] = useState([
        {
            id: "1",
            title: "Lviv → Kyiv",
            price: 320,
            timeWindow: "Today 16:00-18:00",
            confidence: "Very likely fit",
        },
    ]);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
            case "PUBLISHED":
                return "bg-green-100 text-green-800";
            case "PENDING":
            case "DRAFT":
                return "bg-yellow-100 text-yellow-800";
            case "BOARDING":
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800";
            case "PAUSED":
                return "bg-gray-100 text-gray-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const nextTripETA = passengerTrips.length > 0 ? "Tomorrow 14:30" : null;
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "sticky top-0 z-50 bg-background border-b border-border px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 bg-muted animate-pulse rounded" }), _jsx("div", { className: "w-20 h-5 bg-muted animate-pulse rounded" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-muted animate-pulse rounded-full" }), _jsx("div", { className: "w-8 h-8 bg-muted animate-pulse rounded-full" })] })] }) }), _jsx("div", { className: "p-4 space-y-6", children: [...Array(4)].map((_, i) => (_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "w-3/4 h-4 bg-muted animate-pulse rounded" }), _jsx("div", { className: "w-1/2 h-4 bg-muted animate-pulse rounded" }), _jsx("div", { className: "w-full h-4 bg-muted animate-pulse rounded" })] }) }) }, i))) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "sticky top-0 z-50 bg-background border-b border-border px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate("/mobility"), className: "p-1", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold", children: "Carpool" }), nextTripETA && (_jsx(Badge, { variant: "secondary", className: "text-xs mt-1", children: nextTripETA }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", className: "rounded-full", children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "Create ride"] }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-2", children: _jsx(MoreHorizontal, { className: "w-4 h-4" }) })] })] }) }), isOffline && (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Wifi, { className: "w-4 h-4 text-red-400 mr-2" }), _jsx("span", { className: "text-sm text-red-700", children: "You're offline. Some features may not work." }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-auto text-red-700", children: "Retry" })] }) })), _jsxs("div", { className: "p-4 space-y-6 pb-24", children: [_jsx("section", { children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Button, { variant: "outline", className: "h-14 flex-col gap-1", children: [_jsx(Search, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm", children: "Find a ride" })] }), _jsxs(Button, { variant: "outline", className: "h-14 flex-col gap-1", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm", children: "Create a ride" })] }), _jsxs(Button, { variant: "outline", className: "h-14 flex-col gap-1", children: [_jsx(MessageCircle, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm", children: "My chats" })] }), _jsxs(Button, { variant: "outline", className: "h-14 flex-col gap-1", children: [_jsx(Route, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm", children: "Saved routes" })] })] }) }), passengerTrips.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Active as Passenger" }), _jsx("div", { className: "space-y-3", children: passengerTrips.map((trip) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [trip.from, " \u2192 ", trip.to] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [trip.date, " at ", trip.time] })] }), _jsx(Badge, { className: getStatusColor(trip.status), children: trip.status })] }), _jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsxs(Avatar, { className: "w-8 h-8", children: [_jsx(AvatarImage, { src: trip.driver.avatar }), _jsx(AvatarFallback, { children: trip.driver.name.charAt(0) })] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-sm font-medium", children: trip.driver.name }), trip.driver.verified && (_jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "text-xs text-muted-foreground", children: trip.driver.rating })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium", children: ["Seat ", trip.seat] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["\u20B4", trip.price] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", children: "Open" }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(MessageCircle, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(Navigation, { className: "w-4 h-4" }) })] })] }) }, trip.id))) })] })), driverOffers.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "mb-3 text-lg font-semibold", children: "My Offers" }), _jsx("div", { className: "space-y-3", children: driverOffers.map((offer) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [offer.from, " \u2192 ", offer.to] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [offer.date, " at ", offer.time] })] }), _jsx(Badge, { className: getStatusColor(offer.status), children: offer.status })] }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("span", { className: "text-sm", children: [offer.seatsLeft, "/", offer.totalSeats, " ", "left"] })] }), offer.requestsPending > 0 && (_jsxs(Badge, { variant: "secondary", children: [offer.requestsPending, " requests"] }))] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium", children: ["\u20B4", offer.pricePerSeat, "/seat"] }), offer.autoConfirm && (_jsx("p", { className: "text-xs text-green-600", children: "Auto-confirm" }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", children: "Manage" }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(MessageCircle, { className: "w-4 h-4" }) })] })] }) }, offer.id))) })] })), savedRoutes.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Saved Routes" }), _jsx("div", { className: "flex gap-3 overflow-x-auto pb-2", children: savedRoutes.map((route) => (_jsx(Card, { className: "flex-shrink-0 w-64", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "font-medium mb-1", children: route.title }), _jsxs("p", { className: "text-sm text-muted-foreground mb-3", children: ["As ", route.role.toLowerCase()] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", children: "Search" }), _jsx(Button, { size: "sm", variant: "outline", className: "flex-1", children: "Create" })] })] }) }, route.id))) })] })), suggestedMatches.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Suggested for You" }), _jsx("div", { className: "space-y-3", children: suggestedMatches.map((match) => (_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: match.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: match.timeWindow }), _jsx(Badge, { variant: "secondary", className: "text-xs mt-1", children: match.confidence })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: ["\u20B4", match.price] }), _jsx(Button, { size: "sm", className: "mt-2", children: "View" })] })] }) }) }, match.id))) })] })), _jsxs("section", { children: [_jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Safety & Trust" }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Walk With Me" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Share your location with trusted contacts" })] })] }), _jsx(Switch, { className: "data-[state=unchecked]:bg-[var(--switch-background)]", checked: walkWithMeEnabled, onCheckedChange: setWalkWithMeEnabled })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Emergency Contact" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "+380 XX XXX XXXX" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Verification Status" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Phone & ID verified" })] })] })] }) })] }), passengerTrips.length === 0 &&
                        driverOffers.length === 0 && (_jsxs("section", { className: "text-center py-8", children: [_jsx(Car, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "font-medium mb-2", children: "No active trips" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Find a ride or create your own offer to get started" }), _jsxs("div", { className: "flex gap-2 justify-center", children: [_jsx(Button, { children: "Find a ride" }), _jsx(Button, { variant: "outline", children: "Create ride" })] })] }))] }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-background border-t border-border", children: _jsx("div", { className: "flex items-center justify-around py-2", children: [
                        { id: "explore", label: "Explore", icon: Search },
                        { id: "favourite", label: "Favourite", icon: Star },
                        {
                            id: "home",
                            label: "Home",
                            icon: Car,
                            active: true,
                        },
                        {
                            id: "chats",
                            label: "Chats",
                            icon: MessageCircle,
                        },
                        { id: "history", label: "History", icon: Clock },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (_jsxs(Button, { variant: "ghost", size: "sm", className: `flex flex-col gap-1 h-auto py-2 ${item.active
                                ? "text-primary"
                                : "text-muted-foreground"}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: item.label })] }, item.id));
                    }) }) })] }));
};
export default PMobCarpoolHome;
