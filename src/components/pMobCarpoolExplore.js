import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Users, ArrowLeftRight, Plus, Star, ChevronRight, Zap, Shield, HelpCircle, User, TrendingUp, History, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
// Mock data
const popularRoutes = [
    { id: '1', from: 'Lviv', to: 'Kyiv', frequency: 45 },
    { id: '2', from: 'Kyiv', to: 'Odesa', frequency: 32 },
    { id: '3', from: 'Lviv', to: 'Ternopil', frequency: 28 },
    { id: '4', from: 'Kyiv', to: 'Kharkiv', frequency: 25 },
];
const recentSearches = [
    {
        id: '1',
        from: 'Lviv',
        to: 'Kyiv',
        date: '2025-01-20',
        time: '14:30',
        isDriver: false,
        searchedAt: '2025-01-19T10:00:00Z'
    },
    {
        id: '2',
        from: 'Kyiv',
        to: 'Odesa',
        date: '2025-01-22',
        time: '09:00',
        isDriver: true,
        searchedAt: '2025-01-18T15:30:00Z'
    }
];
const savedRoutes = [
    { id: '1', name: 'Work Commute', from: 'Lviv', to: 'Kyiv', isDriver: false },
    { id: '2', name: 'Weekend Trip', from: 'Kyiv', to: 'Odesa', isDriver: true }
];
const suggestedRides = [
    {
        id: '1',
        from: 'Lviv',
        to: 'Kyiv',
        date: '2025-01-20',
        time: '14:30',
        price: 350,
        seatsLeft: 2,
        driver: {
            name: 'Oleksandr M.',
            rating: 4.8,
            avatar: ''
        },
        mode: 'carpool'
    },
    {
        id: '2',
        from: 'Kyiv',
        to: 'Odesa',
        date: '2025-01-21',
        time: '09:15',
        price: 280,
        seatsLeft: 12,
        driver: {
            name: 'FlixBus',
            rating: 4.5,
            avatar: ''
        },
        mode: 'bus'
    }
];
const PMobCarpoolExplore = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: 1,
        roundTrip: false,
        isDriver: false
    });
    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };
    const getQuickPresetDate = (preset) => {
        const now = new Date();
        switch (preset) {
            case 'tonight':
                return {
                    date: now.toISOString().split('T')[0],
                    time: '20:00'
                };
            case 'tomorrow':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return {
                    date: tomorrow.toISOString().split('T')[0],
                    time: '09:00'
                };
            case 'weekend':
                const days = (6 - now.getDay()) % 7 || 7; // Next Saturday
                const weekend = new Date(now);
                weekend.setDate(weekend.getDate() + days);
                return {
                    date: weekend.toISOString().split('T')[0],
                    time: '10:00'
                };
            default:
                return { date: '', time: '' };
        }
    };
    const handleQuickPreset = (preset) => {
        const { date, time } = getQuickPresetDate(preset);
        updateFormData({ date, time });
    };
    const handlePopularRoute = (route) => {
        updateFormData({ from: route.from, to: route.to });
    };
    const handleRecentSearch = (search) => {
        const params = new URLSearchParams({
            from: search.from,
            to: search.to,
            date: search.date,
            time: search.time,
            role: search.isDriver ? 'driver' : 'passenger'
        });
        navigate(`/mobility/carpool/results?${params}`);
    };
    const handleSavedRoute = (route) => {
        const params = new URLSearchParams({
            from: route.from,
            to: route.to,
            role: route.isDriver ? 'driver' : 'passenger'
        });
        navigate(`/mobility/carpool/favourite?${params}`);
    };
    const handleSearch = () => {
        if (!formData.from || !formData.to)
            return;
        const params = new URLSearchParams({
            from: formData.from,
            to: formData.to,
            role: formData.isDriver ? 'driver' : 'passenger'
        });
        if (formData.date)
            params.set('date', formData.date);
        if (formData.time)
            params.set('time', formData.time);
        if (formData.seats > 1)
            params.set('seats', formData.seats.toString());
        if (formData.roundTrip)
            params.set('roundTrip', 'true');
        navigate(`/mobility/carpool/results?${params}`);
    };
    const handleCreateRide = () => {
        const params = new URLSearchParams();
        if (formData.from)
            params.set('from', formData.from);
        if (formData.to)
            params.set('to', formData.to);
        if (formData.date)
            params.set('date', formData.date);
        if (formData.time)
            params.set('time', formData.time);
        navigate(`/mobility/carpool/create?${params}`);
    };
    const swapFromTo = () => {
        updateFormData({
            from: formData.to,
            to: formData.from
        });
    };
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('uk-UA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "p-4 space-y-6 pb-24", children: [_jsx("section", { children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5" }), _jsxs("span", { className: "font-medium", children: ["I'm ", formData.isDriver ? 'offering' : 'looking for', " a ride"] })] }), _jsx(Switch, { className: "data-[state=unchecked]:bg-[var(--switch-background)]", checked: formData.isDriver, onCheckedChange: (checked) => updateFormData({ isDriver: checked }) })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "From (city)", value: formData.from, onChange: (e) => updateFormData({ from: e.target.value }), className: "pl-10 bg-input-background border-none" })] }), _jsxs("div", { className: "relative flex items-center", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "To (city)", value: formData.to, onChange: (e) => updateFormData({ to: e.target.value }), className: "pl-10 bg-input-background border-none" })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: swapFromTo, className: "ml-2 p-2", children: _jsx(ArrowLeftRight, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { type: "date", value: formData.date, onChange: (e) => updateFormData({ date: e.target.value }), className: "pl-10 bg-input-background border-none" })] }), _jsxs("div", { className: "relative", children: [_jsx(Clock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { type: "time", value: formData.time, onChange: (e) => updateFormData({ time: e.target.value }), className: "pl-10 bg-input-background border-none" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-4 h-4 text-muted-foreground" }), _jsx(Label, { children: "Seats" }), _jsx(Input, { type: "number", min: "1", max: "8", value: formData.seats, onChange: (e) => updateFormData({ seats: parseInt(e.target.value) || 1 }), className: "w-16 text-center bg-input-background border-none" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Switch, { className: "data-[state=unchecked]:bg-[var(--switch-background)]", checked: formData.roundTrip, onCheckedChange: (checked) => updateFormData({ roundTrip: checked }) }), _jsx(Label, { children: "Round trip" })] })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsxs(Button, { onClick: handleSearch, className: "flex-1", disabled: !formData.from || !formData.to, children: [_jsx(Search, { className: "w-4 h-4 mr-2" }), formData.isDriver ? 'Find passengers' : 'Find rides'] }), formData.isDriver && (_jsxs(Button, { variant: "outline", onClick: handleCreateRide, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create"] }))] })] })] }) }), _jsxs("section", { children: [_jsx("h3", { className: "mb-3", children: "Quick options" }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: [
                                { id: 'tonight', label: 'Tonight', icon: Clock },
                                { id: 'tomorrow', label: 'Tomorrow morning', icon: Calendar },
                                { id: 'weekend', label: 'This weekend', icon: Zap }
                            ].map((preset) => {
                                const Icon = preset.icon;
                                return (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleQuickPreset(preset.id), className: "flex-shrink-0 gap-1", children: [_jsx(Icon, { className: "w-4 h-4" }), preset.label] }, preset.id));
                            }) })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { children: "Popular routes" }), _jsx(TrendingUp, { className: "w-4 h-4 text-muted-foreground" })] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: popularRoutes.map((route) => (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePopularRoute(route), className: "h-auto py-2 px-3 flex-col items-start text-left", children: [_jsxs("span", { className: "font-medium text-sm", children: [route.from, " \u2192 ", route.to] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [route.frequency, " trips/week"] })] }, route.id))) })] }), (recentSearches.length > 0 || savedRoutes.length > 0) && (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { children: "Recent & Saved" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/mobility/carpool/favourite'), children: ["Manage saved", _jsx(ChevronRight, { className: "w-4 h-4 ml-1" })] })] }), _jsxs("div", { className: "space-y-2", children: [savedRoutes.map((route) => (_jsx(Card, { className: "cursor-pointer hover:bg-accent/50", children: _jsx(CardContent, { className: "p-3", onClick: () => handleSavedRoute(route), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Bookmark, { className: "w-4 h-4 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: route.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [route.from, " \u2192 ", route.to, " \u2022 ", route.isDriver ? 'Driver' : 'Passenger'] })] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })] }) }) }, `saved-${route.id}`))), recentSearches.map((search) => (_jsx(Card, { className: "cursor-pointer hover:bg-accent/50", children: _jsx(CardContent, { className: "p-3", onClick: () => handleRecentSearch(search), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(History, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-sm", children: [search.from, " \u2192 ", search.to] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatDate(search.date), " ", search.time, " \u2022 ", search.isDriver ? 'Driver' : 'Passenger'] })] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })] }) }) }, `recent-${search.id}`)))] })] })), suggestedRides.length > 0 && (_jsxs("section", { children: [_jsx("h3", { className: "mb-3", children: "Suggested for you" }), _jsx("div", { className: "space-y-3", children: suggestedRides.map((ride) => (_jsx(Card, { className: "cursor-pointer hover:bg-accent/50", onClick: () => navigate(`/mobility/carpool/detail/${ride.mode}/${ride.id}`), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [ride.from, " \u2192 ", ride.to] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [formatDate(ride.date), " at ", ride.time] })] }), _jsx(Badge, { variant: "secondary", children: ride.mode })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Avatar, { className: "w-6 h-6", children: [_jsx(AvatarImage, { src: ride.driver.avatar }), _jsx(AvatarFallback, { className: "text-xs", children: ride.driver.name.charAt(0) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium", children: ride.driver.name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "text-xs text-muted-foreground", children: ride.driver.rating })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: ["\u20B4", ride.price] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [ride.seatsLeft, " seats left"] })] })] })] }) }, ride.id))) })] })), _jsx("section", { children: _jsx(Card, { className: "bg-muted/30", children: _jsxs(CardContent, { className: "p-4 text-center", children: [_jsx(Shield, { className: "w-8 h-8 text-primary mx-auto mb-2" }), _jsx("h4", { className: "font-medium mb-2", children: "Safe & Reliable" }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "All drivers are verified. Your safety is our priority." }), _jsxs("div", { className: "flex justify-center gap-4 text-sm", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "h-auto p-1", children: [_jsx(HelpCircle, { className: "w-4 h-4 mr-1" }), "How it works"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "h-auto p-1", children: [_jsx(Shield, { className: "w-4 h-4 mr-1" }), "Safety rules"] })] })] }) }) })] }) }));
};
export default PMobCarpoolExplore;
