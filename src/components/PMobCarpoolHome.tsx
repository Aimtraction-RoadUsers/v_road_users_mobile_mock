import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  MoreHorizontal,
  Search,
  Car,
  MessageCircle,
  Route,
  Star,
  Clock,
  Users,
  Shield,
  Phone,
  Navigation,
  Edit3,
  CheckCircle,
  Wifi,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Switch } from "./ui/switch";
import { useNavigate } from "react-router-dom";

// Types
type TripStatus =
  | "PENDING"
  | "CONFIRMED"
  | "BOARDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
type OfferStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "PAUSED"
  | "CLOSED"
  | "COMPLETED";

interface PassengerTrip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  seat: number;
  price: number;
  bookingCode: string;
  status: TripStatus;
}

interface DriverOffer {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatsLeft: number;
  totalSeats: number;
  requestsPending: number;
  pricePerSeat: number;
  autoConfirm: boolean;
  status: OfferStatus;
}

interface SavedRoute {
  id: string;
  title: string;
  from: string;
  to: string;
  preferredTime: string;
  role: "PASSENGER" | "DRIVER";
}

interface SuggestedMatch {
  id: string;
  title: string;
  price: number;
  timeWindow: string;
  confidence: string;
}

const PMobCarpoolHome: React.FC = () => {
  const navigate = useNavigate();
  const [walkWithMeEnabled, setWalkWithMeEnabled] =
    useState(false);
  const [isOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data
  const [passengerTrips] = useState<PassengerTrip[]>([
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

  const [driverOffers] = useState<DriverOffer[]>([
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

  const [savedRoutes] = useState<SavedRoute[]>([
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

  const [suggestedMatches] = useState<SuggestedMatch[]>([
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

  const getStatusColor = (
    status: TripStatus | OfferStatus,
  ): string => {
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

  const nextTripETA =
    passengerTrips.length > 0 ? "Tomorrow 14:30" : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-muted animate-pulse rounded"></div>
              <div className="w-20 h-5 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
              <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 space-y-6">
          {[...Array(4)].map((_, i) => (
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/mobility")}
              className="p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Carpool</h1>
              {nextTripETA && (
                <Badge
                  variant="secondary"
                  className="text-xs mt-1"
                >
                  {nextTripETA}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              Create ride
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status Banners */}
      {isOffline && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-4">
          <div className="flex items-center">
            <Wifi className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-red-700">
              You're offline. Some features may not work.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6 pb-24">
        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 flex-col gap-1"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm">Find a ride</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-1"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Create a ride</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">My chats</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-1"
            >
              <Route className="w-5 h-5" />
              <span className="text-sm">Saved routes</span>
            </Button>
          </div>
        </section>

        {/* Active as Passenger */}
        {passengerTrips.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Active as Passenger
            </h2>
            <div className="space-y-3">
              {passengerTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">
                          {trip.from} → {trip.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trip.date} at {trip.time}
                        </p>
                      </div>
                      <Badge
                        className={getStatusColor(trip.status)}
                      >
                        {trip.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={trip.driver.avatar} />
                        <AvatarFallback>
                          {trip.driver.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {trip.driver.name}
                          </span>
                          {trip.driver.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {trip.driver.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Seat {trip.seat}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₴{trip.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Open
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Active as Driver */}
        {driverOffers.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              My Offers
            </h2>
            <div className="space-y-3">
              {driverOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">
                          {offer.from} → {offer.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {offer.date} at {offer.time}
                        </p>
                      </div>
                      <Badge
                        className={getStatusColor(offer.status)}
                      >
                        {offer.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {offer.seatsLeft}/{offer.totalSeats}{" "}
                            left
                          </span>
                        </div>
                        {offer.requestsPending > 0 && (
                          <Badge variant="secondary">
                            {offer.requestsPending} requests
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₴{offer.pricePerSeat}/seat
                        </p>
                        {offer.autoConfirm && (
                          <p className="text-xs text-green-600">
                            Auto-confirm
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Manage
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Saved Routes & Favourites */}
        {savedRoutes.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Saved Routes
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {savedRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="flex-shrink-0 w-64"
                >
                  <CardContent className="p-4">
                    <p className="font-medium mb-1">
                      {route.title}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      As {route.role.toLowerCase()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Search
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Create
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Matches */}
        {suggestedMatches.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Suggested for You
            </h2>
            <div className="space-y-3">
              {suggestedMatches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {match.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {match.timeWindow}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs mt-1"
                        >
                          {match.confidence}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₴{match.price}
                        </p>
                        <Button size="sm" className="mt-2">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Safety & Trust */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Safety & Trust
          </h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Walk With Me</p>
                    <p className="text-sm text-muted-foreground">
                      Share your location with trusted contacts
                    </p>
                  </div>
                </div>
                <Switch  className="data-[state=unchecked]:bg-[var(--switch-background)]"
                  checked={walkWithMeEnabled}
                  onCheckedChange={setWalkWithMeEnabled}
                />
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">
                    Emergency Contact
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +380 XX XXX XXXX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">
                    Verification Status
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone & ID verified
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Empty States */}
        {passengerTrips.length === 0 &&
          driverOffers.length === 0 && (
            <section className="text-center py-8">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">
                No active trips
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find a ride or create your own offer to get
                started
              </p>
              <div className="flex gap-2 justify-center">
                <Button>Find a ride</Button>
                <Button variant="outline">Create ride</Button>
              </div>
            </section>
          )}
      </div>

      {/* Local Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {[
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
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-auto py-2 ${
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PMobCarpoolHome;