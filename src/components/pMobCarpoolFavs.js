import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Heart, RefreshCw, Clock, Users, Train, Bus, Car, Trash2, AlertCircle, CheckCircle, XCircle, Info, Crown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';
// Utility functions
function isStale(f) {
    return Date.now() - new Date(f.savedAt).getTime() > f.ttlSeconds * 1000;
}
function getProviderName(provider) {
    switch (provider) {
        case 'vp': return 'vPoputku';
        case 'flix': return 'FlixBus';
        case 'udz': return 'UZ';
        default: return provider;
    }
}
function getKindIcon(kind) {
    switch (kind) {
        case 'carpool': return Car;
        case 'bus': return Bus;
        case 'train': return Train;
        default: return Car;
    }
}
function getStatusColor(status) {
    switch (status) {
        case 'fresh': return 'bg-green-100 text-green-800';
        case 'available': return 'bg-blue-100 text-blue-800';
        case 'changed': return 'bg-yellow-100 text-yellow-800';
        case 'stale': return 'bg-gray-100 text-gray-800';
        case 'sold_out': return 'bg-red-100 text-red-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'error': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
function getStatusIcon(status) {
    switch (status) {
        case 'fresh':
        case 'available': return CheckCircle;
        case 'changed': return AlertCircle;
        case 'stale': return Clock;
        case 'sold_out':
        case 'cancelled':
        case 'error': return XCircle;
        default: return Info;
    }
}
// Mock data
const mockFavorites = [
    {
        id: '1',
        kind: 'carpool',
        provider: 'vp',
        rideId: 'ride123',
        savedAt: '2025-01-19T10:00:00Z',
        ttlSeconds: 120,
        snapshot: {
            priceUAH: 350,
            from: 'Lviv',
            to: 'Kyiv',
            dateISO: '2025-01-20',
            departTime: '14:30',
            seatsLeft: 2,
            title: 'Oleksandr M.'
        }
    },
    {
        id: '2',
        kind: 'bus',
        provider: 'flix',
        routeTitle: 'FB-123',
        dateISO: '2025-01-21',
        departTime: '09:15',
        savedAt: '2025-01-19T08:00:00Z',
        ttlSeconds: 600,
        snapshot: {
            priceUAH: 280,
            from: 'Kyiv',
            to: 'Odesa',
            dateISO: '2025-01-21',
            departTime: '09:15',
            seatsLeft: 12,
            title: 'FlixBus Express'
        }
    },
    {
        id: '3',
        kind: 'train',
        provider: 'udz',
        trainNo: '143',
        from: 'Lviv',
        to: 'Kyiv',
        dateISO: '2025-01-22',
        departTime: '23:45',
        carriageType: 'kupe',
        savedAt: '2025-01-18T15:00:00Z',
        ttlSeconds: 300,
        snapshot: {
            priceUAH: 420,
            from: 'Lviv',
            to: 'Kyiv',
            dateISO: '2025-01-22',
            departTime: '23:45',
            seatsLeft: 8,
            title: 'Train #143 Kupe'
        }
    }
];
// Mock revalidation function
async function revalidateFavorite(favorite) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock different scenarios
    const scenarios = ['available', 'changed', 'sold_out', 'error'];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    switch (scenario) {
        case 'available':
            return {
                status: 'available',
                offer: {
                    ...favorite.snapshot,
                    priceUAH: favorite.snapshot.priceUAH + Math.floor(Math.random() * 50) - 25
                }
            };
        case 'changed':
            return {
                status: 'changed',
                offer: {
                    ...favorite.snapshot,
                    priceUAH: favorite.snapshot.priceUAH + 50,
                    seatsLeft: Math.max(0, (favorite.snapshot.seatsLeft || 0) - 1)
                },
                diff: {
                    priceChange: 50,
                    seatsChange: -1
                }
            };
        case 'sold_out':
            return { status: 'sold_out' };
        case 'error':
            return { status: 'error' };
        default:
            return { status: 'available' };
    }
}
// Custom hook
function useFavorites() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Initialize with mock data and determine initial status
        const favoritesWithStatus = mockFavorites.map(fav => ({
            ...fav,
            status: isStale(fav) ? 'stale' : 'fresh',
            isRefreshing: false
        }));
        setItems(favoritesWithStatus);
        setIsLoading(false);
    }, []);
    const refreshOne = async (id) => {
        setItems(xs => xs.map(x => x.id === id ? { ...x, isRefreshing: true } : x));
        const item = items.find(i => i.id === id);
        if (!item)
            return;
        try {
            const result = await revalidateFavorite(item);
            setItems(xs => xs.map(i => {
                if (i.id !== id)
                    return i;
                return {
                    ...i,
                    status: result.status,
                    live: result.offer,
                    diff: result.diff,
                    isRefreshing: false,
                    savedAt: new Date().toISOString() // Update timestamp after refresh
                };
            }));
        }
        catch (error) {
            setItems(xs => xs.map(i => i.id === id ? { ...i, status: 'error', isRefreshing: false } : i));
        }
    };
    const refreshAll = async () => {
        const refreshPromises = items.map(item => refreshOne(item.id));
        await Promise.all(refreshPromises);
    };
    const removeFavorite = (id) => {
        setItems(xs => xs.filter(x => x.id !== id));
    };
    const addFavorite = (favorite) => {
        if (items.length >= 10) {
            throw new Error('Maximum 10 favorites allowed in free tier');
        }
        setItems(xs => [...xs, { ...favorite, status: 'fresh', isRefreshing: false }]);
    };
    return {
        items,
        isLoading,
        refreshOne,
        refreshAll,
        removeFavorite,
        addFavorite,
        hasSpace: items.length < 10
    };
}
const PMobCarpoolFavs = () => {
    const navigate = useNavigate();
    const { items, isLoading, refreshOne, refreshAll, removeFavorite, hasSpace } = useFavorites();
    const [isRefreshingAll, setIsRefreshingAll] = useState(false);
    const handleRefreshAll = async () => {
        setIsRefreshingAll(true);
        await refreshAll();
        setIsRefreshingAll(false);
    };
    const formatDate = (dateISO) => {
        return new Date(dateISO).toLocaleDateString('uk-UA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };
    const formatTimeSince = (savedAt) => {
        const now = new Date();
        const saved = new Date(savedAt);
        const diffMinutes = Math.floor((now.getTime() - saved.getTime()) / (1000 * 60));
        if (diffMinutes < 60)
            return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24)
            return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-background", children: _jsx("div", { className: "p-4 space-y-4", children: [...Array(3)].map((_, i) => (_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "w-3/4 h-4 bg-muted animate-pulse rounded" }), _jsx("div", { className: "w-1/2 h-4 bg-muted animate-pulse rounded" }), _jsx("div", { className: "w-full h-4 bg-muted animate-pulse rounded" })] }) }) }, i))) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "sticky top-0 z-50 bg-background border-b border-border px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Heart, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold", children: "Favorites" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [items.length, "/10 saved"] })] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleRefreshAll, disabled: isRefreshingAll || items.length === 0, children: [_jsx(RefreshCw, { className: `w-4 h-4 mr-1 ${isRefreshingAll ? 'animate-spin' : ''}` }), "Update all"] }) })] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs(Alert, { children: [_jsx(Crown, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Free Tier:" }), " Save up to 10 favorites. Data shows snapshot from when saved. Press \"Update\" to refresh manually."] })] }), items.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Heart, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "font-medium mb-2", children: "No favorites yet" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Save your favorite routes and trips to access them quickly" }), _jsxs(Button, { onClick: () => navigate('/mobility/carpool/explore'), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Explore trips"] })] })) : (_jsx("div", { className: "space-y-3", children: items.map((item) => {
                            const KindIcon = getKindIcon(item.kind);
                            const StatusIcon = getStatusIcon(item.status);
                            const isStaleItem = isStale(item);
                            return (_jsx(Card, { className: "relative", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(KindIcon, { className: "w-5 h-5 text-muted-foreground" }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [item.snapshot.from, " \u2192 ", item.snapshot.to] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [getProviderName(item.provider), " \u2022 ", item.snapshot.title] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => removeFavorite(item.id), className: "text-muted-foreground hover:text-destructive", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: formatDate(item.snapshot.dateISO) }), _jsx("p", { className: "text-xs text-muted-foreground", children: item.snapshot.departTime })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium", children: ["\u20B4", item.live?.priceUAH || item.snapshot.priceUAH] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [item.snapshot.seatsLeft, " seats left"] })] })] })] }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { className: getStatusColor(item.status), children: [_jsx(StatusIcon, { className: "w-3 h-3 mr-1" }), item.status === 'stale' ? 'Needs update' : item.status] }), isStaleItem && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Saved ", formatTimeSince(item.savedAt)] }))] }), item.diff && (_jsxs("div", { className: "flex gap-1", children: [item.diff.priceChange && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [item.diff.priceChange > 0 ? '+' : '', "\u20B4", item.diff.priceChange] })), item.diff.seatsChange && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [item.diff.seatsChange > 0 ? '+' : '', item.diff.seatsChange, " seats"] }))] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => refreshOne(item.id), disabled: item.isRefreshing, className: "flex-1", children: [_jsx(RefreshCw, { className: `w-4 h-4 mr-1 ${item.isRefreshing ? 'animate-spin' : ''}` }), item.isRefreshing ? 'Updating...' : 'Update'] }), item.status === 'available' || item.status === 'changed' ? (_jsx(Button, { size: "sm", className: "flex-1", children: "View Details" })) : item.status === 'sold_out' ? (_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", disabled: true, children: "Sold Out" })) : item.status === 'cancelled' ? (_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", disabled: true, children: "Cancelled" })) : (_jsx(Button, { size: "sm", variant: "outline", className: "flex-1", children: "Search Similar" }))] })] }) }, item.id));
                        }) })), items.length > 0 && hasSpace && (_jsx(Card, { className: "border-dashed", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(Plus, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-3", children: ["Add more favorites (", items.length, "/10 used)"] }), _jsx(Button, { variant: "outline", onClick: () => navigate('/mobility/carpool/explore'), children: "Browse more trips" })] }) })), !hasSpace && (_jsxs(Alert, { children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "You've reached the 10 favorite limit for free accounts. Remove some to add new ones." })] }))] })] }));
};
export default PMobCarpoolFavs;
