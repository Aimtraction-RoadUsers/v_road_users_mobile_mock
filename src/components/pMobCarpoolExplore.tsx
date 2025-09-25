import React, { useState} from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeftRight, 
  Plus,
  Star,
  ChevronRight,
  Zap,
  Shield,
  HelpCircle,
  User,
  TrendingUp,
  History,
  Bookmark
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';

interface SearchFormData {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  roundTrip: boolean;
  isDriver: boolean;
}

interface PopularRoute {
  id: string;
  from: string;
  to: string;
  frequency: number;
}

interface RecentSearch {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  isDriver: boolean;
  searchedAt: string;
}

interface SavedRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  isDriver: boolean;
}

interface SuggestedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seatsLeft: number;
  driver: {
    name: string;
    rating: number;
    avatar: string;
  };
  mode: 'carpool' | 'bus' | 'train';
}

// Mock data
const popularRoutes: PopularRoute[] = [
  { id: '1', from: 'Lviv', to: 'Kyiv', frequency: 45 },
  { id: '2', from: 'Kyiv', to: 'Odesa', frequency: 32 },
  { id: '3', from: 'Lviv', to: 'Ternopil', frequency: 28 },
  { id: '4', from: 'Kyiv', to: 'Kharkiv', frequency: 25 },
];

const recentSearches: RecentSearch[] = [
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

const savedRoutes: SavedRoute[] = [
  { id: '1', name: 'Work Commute', from: 'Lviv', to: 'Kyiv', isDriver: false },
  { id: '2', name: 'Weekend Trip', from: 'Kyiv', to: 'Odesa', isDriver: true }
];

const suggestedRides: SuggestedRide[] = [
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

const PMobCarpoolExplore: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SearchFormData>({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    roundTrip: false,
    isDriver: false
  });

  const updateFormData = (updates: Partial<SearchFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getQuickPresetDate = (preset: 'tonight' | 'tomorrow' | 'weekend') => {
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

  const handleQuickPreset = (preset: 'tonight' | 'tomorrow' | 'weekend') => {
    const { date, time } = getQuickPresetDate(preset);
    updateFormData({ date, time });
  };

  const handlePopularRoute = (route: PopularRoute) => {
    updateFormData({ from: route.from, to: route.to });
  };

  const handleRecentSearch = (search: RecentSearch) => {
    const params = new URLSearchParams({
      from: search.from,
      to: search.to,
      date: search.date,
      time: search.time,
      role: search.isDriver ? 'driver' : 'passenger'
    });
    navigate(`/mobility/carpool/results?${params}`);
  };

  const handleSavedRoute = (route: SavedRoute) => {
    const params = new URLSearchParams({
      from: route.from,
      to: route.to,
      role: route.isDriver ? 'driver' : 'passenger'
    });
    navigate(`/mobility/carpool/favourite?${params}`);
  };

  const handleSearch = () => {
    if (!formData.from || !formData.to) return;
    
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      role: formData.isDriver ? 'driver' : 'passenger'
    });
    
    if (formData.date) params.set('date', formData.date);
    if (formData.time) params.set('time', formData.time);
    if (formData.seats > 1) params.set('seats', formData.seats.toString());
    if (formData.roundTrip) params.set('roundTrip', 'true');
    
    navigate(`/mobility/carpool/results?${params}`);
  };

  const handleCreateRide = () => {
    const params = new URLSearchParams();
    if (formData.from) params.set('from', formData.from);
    if (formData.to) params.set('to', formData.to);
    if (formData.date) params.set('date', formData.date);
    if (formData.time) params.set('time', formData.time);
    
    navigate(`/mobility/carpool/create?${params}`);
  };

  const swapFromTo = () => {
    updateFormData({
      from: formData.to,
      to: formData.from
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6 pb-24">
        {/* Search Hero Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    I'm {formData.isDriver ? 'offering' : 'looking for'} a ride
                  </span>
                </div>
                <Switch  className="data-[state=unchecked]:bg-[var(--switch-background)]"
                  checked={formData.isDriver}
                  onCheckedChange={(checked) => updateFormData({ isDriver: checked })}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* From/To Fields */}
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="From (city)"
                    value={formData.from}
                    onChange={(e) => updateFormData({ from: e.target.value })}
                    className="pl-10 bg-input-background border-none"
                  />
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="To (city)"
                      value={formData.to}
                      onChange={(e) => updateFormData({ to: e.target.value })}
                      className="pl-10 bg-input-background border-none"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={swapFromTo}
                    className="ml-2 p-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Date/Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData({ date: e.target.value })}
                    className="pl-10 bg-input-background border-none"
                  />
                </div>
                
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateFormData({ time: e.target.value })}
                    className="pl-10 bg-input-background border-none"
                  />
                </div>
              </div>

              {/* Optional Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label>Seats</Label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.seats}
                    onChange={(e) => updateFormData({ seats: parseInt(e.target.value) || 1 })}
                    className="w-16 text-center bg-input-background border-none"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch  className="data-[state=unchecked]:bg-[var(--switch-background)]"
                    checked={formData.roundTrip}
                    onCheckedChange={(checked) => updateFormData({ roundTrip: checked })}
                  />
                  <Label>Round trip</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSearch}
                  className="flex-1"
                  disabled={!formData.from || !formData.to}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {formData.isDriver ? 'Find passengers' : 'Find rides'}
                </Button>
                
                {formData.isDriver && (
                  <Button 
                    variant="outline" 
                    onClick={handleCreateRide}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Presets */}
        <section>
          <h3 className="mb-3">Quick options</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'tonight', label: 'Tonight', icon: Clock },
              { id: 'tomorrow', label: 'Tomorrow morning', icon: Calendar },
              { id: 'weekend', label: 'This weekend', icon: Zap }
            ].map((preset) => {
              const Icon = preset.icon;
              return (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPreset(preset.id as any)}
                  className="flex-shrink-0 gap-1"
                >
                  <Icon className="w-4 h-4" />
                  {preset.label}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Popular Routes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3>Popular routes</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {popularRoutes.map((route) => (
              <Button
                key={route.id}
                variant="outline"
                size="sm"
                onClick={() => handlePopularRoute(route)}
                className="h-auto py-2 px-3 flex-col items-start text-left"
              >
                <span className="font-medium text-sm">
                  {route.from} → {route.to}
                </span>
                <span className="text-xs text-muted-foreground">
                  {route.frequency} trips/week
                </span>
              </Button>
            ))}
          </div>
        </section>

        {/* Recent Searches & Saved Routes */}
        {(recentSearches.length > 0 || savedRoutes.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3>Recent & Saved</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/mobility/carpool/favourite')}
              >
                Manage saved
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {savedRoutes.map((route) => (
                <Card key={`saved-${route.id}`} className="cursor-pointer hover:bg-accent/50">
                  <CardContent 
                    className="p-3"
                    onClick={() => handleSavedRoute(route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{route.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {route.from} → {route.to} • {route.isDriver ? 'Driver' : 'Passenger'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {recentSearches.map((search) => (
                <Card key={`recent-${search.id}`} className="cursor-pointer hover:bg-accent/50">
                  <CardContent 
                    className="p-3"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">
                            {search.from} → {search.to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(search.date)} {search.time} • {search.isDriver ? 'Driver' : 'Passenger'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Rides */}
        {suggestedRides.length > 0 && (
          <section>
            <h3 className="mb-3">Suggested for you</h3>
            <div className="space-y-3">
              {suggestedRides.map((ride) => (
                <Card 
                  key={ride.id} 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => navigate(`/mobility/carpool/detail/${ride.mode}/${ride.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">
                          {ride.from} → {ride.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(ride.date)} at {ride.time}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {ride.mode}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={ride.driver.avatar} />
                          <AvatarFallback className="text-xs">
                            {ride.driver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-medium">{ride.driver.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              {ride.driver.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">₴{ride.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {ride.seatsLeft} seats left
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Footer / FAQ */}
        <section>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-2">Safe & Reliable</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All drivers are verified. Your safety is our priority.
              </p>
              
              <div className="flex justify-center gap-4 text-sm">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  How it works
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Safety rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PMobCarpoolExplore;