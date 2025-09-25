import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  RefreshCw, 
  Clock, 
  Users, 
  Train, 
  Bus, 
  Car, 
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Crown,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';

// Types from specification
type FavStatus = "fresh" | "stale" | "available" | "changed" | "sold_out" | "cancelled" | "error";

type FavoriteBase = {
  id: string;
  kind: "carpool" | "bus" | "train";
  provider: string;
  savedAt: string;
  ttlSeconds: number;
  snapshot: {
    priceUAH: number;
    from: string;
    to: string;
    dateISO: string;
    departTime?: string;
    seatsLeft?: number;
    title?: string;
  };
};

type FavoriteRef =
  | { kind: "carpool"; rideId: string }
  | { kind: "bus"; routeTitle: string; dateISO: string; departTime: string; fareCode?: string }
  | { kind: "train"; trainNo?: string; from: string; to: string; dateISO: string; departTime: string; carriageType?: string };

type Favorite = FavoriteBase & FavoriteRef;

type FavoriteWithStatus = Favorite & {
  status: FavStatus;
  live?: any;
  diff?: any;
  isRefreshing?: boolean;
};

// Utility functions
function isStale(f: Favorite): boolean {
  return Date.now() - new Date(f.savedAt).getTime() > f.ttlSeconds * 1000;
}

function getProviderName(provider: string): string {
  switch (provider) {
    case 'vp': return 'vPoputku';
    case 'flix': return 'FlixBus';
    case 'udz': return 'UZ';
    default: return provider;
  }
}

function getKindIcon(kind: string) {
  switch (kind) {
    case 'carpool': return Car;
    case 'bus': return Bus;
    case 'train': return Train;
    default: return Car;
  }
}

function getStatusColor(status: FavStatus): string {
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

function getStatusIcon(status: FavStatus) {
  switch (status) {
    case 'fresh': case 'available': return CheckCircle;
    case 'changed': return AlertCircle;
    case 'stale': return Clock;
    case 'sold_out': case 'cancelled': case 'error': return XCircle;
    default: return Info;
  }
}

// Mock data
const mockFavorites: Favorite[] = [
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
async function revalidateFavorite(favorite: Favorite): Promise<{
  status: FavStatus;
  offer?: any;
  diff?: any;
}> {
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
  const [items, setItems] = useState<FavoriteWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data and determine initial status
    const favoritesWithStatus = mockFavorites.map(fav => ({
      ...fav,
      status: isStale(fav) ? 'stale' as FavStatus : 'fresh' as FavStatus,
      isRefreshing: false
    }));
    
    setItems(favoritesWithStatus);
    setIsLoading(false);
  }, []);

  const refreshOne = async (id: string) => {
    setItems(xs => xs.map(x => x.id === id ? { ...x, isRefreshing: true } : x));
    
    const item = items.find(i => i.id === id);
    if (!item) return;

    try {
      const result = await revalidateFavorite(item);
      
      setItems(xs => xs.map(i => {
        if (i.id !== id) return i;
        return {
          ...i,
          status: result.status,
          live: result.offer,
          diff: result.diff,
          isRefreshing: false,
          savedAt: new Date().toISOString() // Update timestamp after refresh
        };
      }));
    } catch (error) {
      setItems(xs => xs.map(i => 
        i.id === id ? { ...i, status: 'error' as FavStatus, isRefreshing: false } : i
      ));
    }
  };

  const refreshAll = async () => {
    const refreshPromises = items.map(item => refreshOne(item.id));
    await Promise.all(refreshPromises);
  };

  const removeFavorite = (id: string) => {
    setItems(xs => xs.filter(x => x.id !== id));
  };

  const addFavorite = (favorite: Favorite) => {
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

const PMobCarpoolFavs: React.FC = () => {
  const navigate = useNavigate();
  const { items, isLoading, refreshOne, refreshAll, removeFavorite, hasSpace } = useFavorites();
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    await refreshAll();
    setIsRefreshingAll(false);
  };

  const formatDate = (dateISO: string) => {
    return new Date(dateISO).toLocaleDateString('uk-UA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeSince = (savedAt: string) => {
    const now = new Date();
    const saved = new Date(savedAt);
    const diffMinutes = Math.floor((now.getTime() - saved.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="w-3/4 h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-1/2 h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-semibold">Favorites</h1>
              <p className="text-sm text-muted-foreground">
                {items.length}/10 saved
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRefreshingAll || items.length === 0}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshingAll ? 'animate-spin' : ''}`} />
              Update all
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Free Tier Info */}
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            <strong>Free Tier:</strong> Save up to 10 favorites. Data shows snapshot from when saved. 
            Press "Update" to refresh manually.
          </AlertDescription>
        </Alert>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No favorites yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save your favorite routes and trips to access them quickly
            </p>
            <Button onClick={() => navigate('/mobility/carpool/explore')}>
              <Plus className="w-4 h-4 mr-2" />
              Explore trips
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const KindIcon = getKindIcon(item.kind);
              const StatusIcon = getStatusIcon(item.status);
              const isStaleItem = isStale(item);
              
              return (
                <Card key={item.id} className="relative">
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <KindIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {item.snapshot.from} → {item.snapshot.to}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getProviderName(item.provider)} • {item.snapshot.title}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {formatDate(item.snapshot.dateISO)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.snapshot.departTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            ₴{item.live?.priceUAH || item.snapshot.priceUAH}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.snapshot.seatsLeft} seats left
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Changes */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {item.status === 'stale' ? 'Needs update' : item.status}
                        </Badge>
                        {isStaleItem && (
                          <span className="text-xs text-muted-foreground">
                            Saved {formatTimeSince(item.savedAt)}
                          </span>
                        )}
                      </div>
                      
                      {item.diff && (
                        <div className="flex gap-1">
                          {item.diff.priceChange && (
                            <Badge variant="outline" className="text-xs">
                              {item.diff.priceChange > 0 ? '+' : ''}₴{item.diff.priceChange}
                            </Badge>
                          )}
                          {item.diff.seatsChange && (
                            <Badge variant="outline" className="text-xs">
                              {item.diff.seatsChange > 0 ? '+' : ''}{item.diff.seatsChange} seats
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshOne(item.id)}
                        disabled={item.isRefreshing}
                        className="flex-1"
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${item.isRefreshing ? 'animate-spin' : ''}`} />
                        {item.isRefreshing ? 'Updating...' : 'Update'}
                      </Button>
                      
                      {item.status === 'available' || item.status === 'changed' ? (
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                      ) : item.status === 'sold_out' ? (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Sold Out
                        </Button>
                      ) : item.status === 'cancelled' ? (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Cancelled
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          Search Similar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add More CTA */}
        {items.length > 0 && hasSpace && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Add more favorites ({items.length}/10 used)
              </p>
              <Button variant="outline" onClick={() => navigate('/mobility/carpool/explore')}>
                Browse more trips
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Limit Warning */}
        {!hasSpace && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached the 10 favorite limit for free accounts. Remove some to add new ones.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PMobCarpoolFavs;