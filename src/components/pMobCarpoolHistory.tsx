import React, { useState, useMemo } from "react";

import { cn } from "./ui/utils";
import {
  Clock,
  Car,
  Bus,
  Train,
  Star,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Shield,
  Wrench,
  User,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  MapPin,
  ExternalLink,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useNavigate } from "react-router-dom";

// Enhanced types for multi-service history
type ServiceType =
  | "carpool"
  | "bus"
  | "train"
  | "sto"
  | "insurance"
  | "parking"
  | "fuel";
type EventStatus =
  | "ACTIVE"
  | "CONFIRMED"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
type UserRole = "PASSENGER" | "DRIVER";

interface HistoryEvent {
  id: string;
  service: ServiceType;
  provider: string;
  title: string;
  from?: string;
  to?: string;
  date: string;
  time?: string;
  price?: number;
  status: EventStatus;
  role: UserRole;
  bookingCode?: string;
  driver?: {
    name: string;
    avatar: string;
    rating?: number;
  };
  seat?: number;
  canRate?: boolean;
  canRebook?: boolean;
  description?: string;
  location?: string;
  deepLink?: string;
}

interface ServiceInfo {
  id: ServiceType;
  name: string;
  icon: any;
  color: string;
  activeCount: number;
}

// Mock comprehensive data across all services
const mockHistoryEvents: HistoryEvent[] = [
  // Active events (mixed services)
  {
    id: "1",
    service: "carpool",
    provider: "vp",
    title: "Lviv → Kyiv",
    from: "Lviv",
    to: "Kyiv",
    date: "2025-01-21",
    time: "14:30",
    price: 350,
    status: "CONFIRMED",
    role: "PASSENGER",
    bookingCode: "ABC123",
    driver: {
      name: "Oleksandr M.",
      avatar: "",
      rating: 4.8,
    },
    seat: 2,
    canRate: false,
    canRebook: false,
    deepLink: "/mobility/carpool/detail/carpool/1",
  },
  {
    id: "2",
    service: "bus",
    provider: "flix",
    title: "Kyiv → Odesa",
    from: "Kyiv",
    to: "Odesa",
    date: "2025-01-22",
    time: "09:15",
    price: 280,
    status: "ACTIVE",
    role: "PASSENGER",
    bookingCode: "FB456",
    canRebook: false,
    deepLink: "/mobility/bus/detail/2",
  },
  {
    id: "3",
    service: "sto",
    provider: "autoservice",
    title: "Oil change",
    date: "2025-01-23",
    time: "11:00",
    price: 800,
    status: "PENDING",
    role: "DRIVER",
    bookingCode: "STO789",
    location: "AutoService Plus, Lviv",
    description: "Regular maintenance - oil and filter change",
    deepLink: "/care/sto/detail/3",
  },
  {
    id: "4",
    service: "carpool",
    provider: "vp",
    title: "Kyiv → Kharkiv",
    from: "Kyiv",
    to: "Kharkiv",
    date: "2025-01-25",
    time: "08:00",
    price: 400,
    status: "ACTIVE",
    role: "DRIVER",
    description: "3 passengers booked, 1 seat left",
    deepLink: "/mobility/carpool/manage/4",
  },

  // Past events
  {
    id: "5",
    service: "carpool",
    provider: "vp",
    title: "Lviv → Kyiv",
    from: "Lviv",
    to: "Kyiv",
    date: "2025-01-15",
    time: "14:30",
    price: 350,
    status: "COMPLETED",
    role: "PASSENGER",
    bookingCode: "ABC124",
    driver: {
      name: "Ivan P.",
      avatar: "",
      rating: 4.9,
    },
    seat: 3,
    canRate: true,
    canRebook: true,
  },
  {
    id: "6",
    service: "train",
    provider: "udz",
    title: "Kyiv → Lviv",
    from: "Kyiv",
    to: "Lviv",
    date: "2025-01-10",
    time: "22:15",
    price: 480,
    status: "COMPLETED",
    role: "PASSENGER",
    bookingCode: "UZ456",
    canRebook: true,
  },
  {
    id: "7",
    service: "insurance",
    provider: "pzu",
    title: "Car Insurance Renewal",
    date: "2025-01-08",
    price: 2500,
    status: "COMPLETED",
    role: "DRIVER",
    bookingCode: "INS789",
    description: "Annual comprehensive coverage",
  },

  // Cancelled events
  {
    id: "8",
    service: "carpool",
    provider: "vp",
    title: "Kyiv → Odesa",
    from: "Kyiv",
    to: "Odesa",
    date: "2025-01-05",
    time: "16:00",
    price: 380,
    status: "CANCELLED",
    role: "PASSENGER",
    bookingCode: "ABC125",
    driver: {
      name: "Maria K.",
      avatar: "",
    },
  },
  {
    id: "9",
    service: "bus",
    provider: "flix",
    title: "Lviv → Warsaw",
    from: "Lviv",
    to: "Warsaw",
    date: "2025-01-03",
    time: "08:30",
    price: 450,
    status: "CANCELLED",
    role: "PASSENGER",
    bookingCode: "FB789",
  },
];

// Service configuration
const serviceConfig: Record<ServiceType, ServiceInfo> = {
  carpool: {
    id: "carpool",
    name: "Carpool",
    icon: Car,
    color: "text-blue-600",
    activeCount: 0,
  },
  bus: {
    id: "bus",
    name: "Bus",
    icon: Bus,
    color: "text-green-600",
    activeCount: 0,
  },
  train: {
    id: "train",
    name: "Train",
    icon: Train,
    color: "text-purple-600",
    activeCount: 0,
  },
  sto: {
    id: "sto",
    name: "STO",
    icon: Wrench,
    color: "text-orange-600",
    activeCount: 0,
  },
  insurance: {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    color: "text-red-600",
    activeCount: 0,
  },
  parking: {
    id: "parking",
    name: "Parking",
    icon: Car,
    color: "text-gray-600",
    activeCount: 0,
  },
  fuel: {
    id: "fuel",
    name: "Fuel",
    icon: Car,
    color: "text-yellow-600",
    activeCount: 0,
  },
};

function getStatusColor(status: EventStatus): string {
  switch (status) {
    case "ACTIVE":
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "NO_SHOW":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status: EventStatus) {
  switch (status) {
    case "ACTIVE":
    case "CONFIRMED":
      return CheckCircle;
    case "PENDING":
      return Clock;
    case "COMPLETED":
      return CheckCircle;
    case "CANCELLED":
    case "NO_SHOW":
      return XCircle;
    default:
      return AlertCircle;
  }
}

function getProviderName(provider: string): string {
  const providers: Record<string, string> = {
    vp: "vPoputku",
    flix: "FlixBus",
    udz: "Ukrainian Railways",
    autoservice: "AutoService",
    pzu: "PZU Insurance",
  };
  return providers[provider] || provider;
}

const PMobCarpoolHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState<UserRole>("PASSENGER");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<
    ServiceType[]
  >([]);
  const [selectedStatus, setSelectedStatus] =
    useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >(undefined);
  const [showServiceFilter, setShowServiceFilter] =
    useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    active: true,
    past: true,
    cancelled: false,
  });

  // Get dates that have events for calendar marking
  const eventDates = useMemo(() => {
    const dates = mockHistoryEvents
      .filter((event) => event.role === activeTab)
      .map((event) => new Date(event.date));
    return dates;
  }, [activeTab]);

  // Filter and organize events
  const filteredEvents = useMemo(() => {
    let events = mockHistoryEvents.filter((event) => {
      const matchesRole = event.role === activeTab;
      const matchesSearch =
        !searchQuery ||
        event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.bookingCode
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.from
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.to
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesService =
        selectedServices.length === 0 ||
        selectedServices.includes(event.service);
      const matchesStatus =
        selectedStatus === "all" ||
        event.status === selectedStatus;
      const matchesDate =
        !selectedDate ||
        new Date(event.date).toDateString() ===
          selectedDate.toDateString();

      return (
        matchesRole &&
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesDate
      );
    });

    // If date filter is active, sort by time instead of grouping by status
    if (selectedDate) {
      const sortByTime = (a: HistoryEvent, b: HistoryEvent) => {
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      };

      return {
        active: events.sort(sortByTime),
        past: [],
        cancelled: [],
      };
    }

    // Group by status
    const active = events.filter((e) =>
      ["ACTIVE", "CONFIRMED", "PENDING"].includes(e.status),
    );
    const past = events.filter((e) => e.status === "COMPLETED");
    const cancelled = events.filter((e) =>
      ["CANCELLED", "NO_SHOW"].includes(e.status),
    );

    // Sort within each group
    const sortByTime = (a: HistoryEvent, b: HistoryEvent) =>
      new Date(b.date).getTime() - new Date(a.date).getTime();

    return {
      active: active.sort(sortByTime),
      past: past.sort(sortByTime),
      cancelled: cancelled.sort(sortByTime),
    };
  }, [
    activeTab,
    searchQuery,
    selectedServices,
    selectedStatus,
    selectedDate,
  ]);

  // Calculate active services for filter
  const activeServices = useMemo(() => {
    const counts: Record<ServiceType, number> = {} as any;
    mockHistoryEvents
      .filter(
        (event) =>
          event.role === activeTab &&
          ["ACTIVE", "CONFIRMED", "PENDING"].includes(
            event.status,
          ),
      )
      .forEach((event) => {
        counts[event.service] =
          (counts[event.service] || 0) + 1;
      });

    return Object.entries(serviceConfig)
      .filter(([service]) => counts[service as ServiceType] > 0)
      .map(([service, config]) => ({
        ...config,
        activeCount: counts[service as ServiceType] || 0,
      }));
  }, [activeTab]);

  const handleServiceFilterToggle = (service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const handleEventClick = (event: HistoryEvent) => {
    if (event.deepLink) {
      navigate(event.deepLink);
    }
  };

  const handleRebook = (event: HistoryEvent) => {
    if (event.service === "carpool") {
      navigate("/mobility/carpool/explore", {
        state: {
          from: event.from,
          to: event.to,
          prefillData: true,
        },
      });
    }
  };

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(
        now.getTime() + 24 * 60 * 60 * 1000,
      ).toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString("uk-UA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    setShowCalendar(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const renderEventCard = (event: HistoryEvent) => {
    const ServiceIcon = serviceConfig[event.service].icon;
    const StatusIcon = getStatusIcon(event.status);
    const isActive = [
      "ACTIVE",
      "CONFIRMED",
      "PENDING",
    ].includes(event.status);

    return (
      <Card
        key={event.id}
        className={`cursor-pointer hover:bg-accent/50 ${isActive ? "border-l-4 border-l-primary" : ""}`}
        onClick={() => handleEventClick(event)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <ServiceIcon
                className={`w-5 h-5 ${serviceConfig[event.service].color}`}
              />
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {getProviderName(event.provider)}
                  {event.bookingCode &&
                    ` • ${event.bookingCode}`}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(event.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {event.status}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(event.date)}</span>
              {event.time && <span>at {event.time}</span>}
            </div>

            {event.from && event.to && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {event.from} → {event.to}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>

          {/* Driver info (for carpool) */}
          {event.driver && (
            <div className="flex items-center gap-3 mb-3 p-2 bg-muted rounded-lg">
              <Avatar className="w-6 h-6">
                <AvatarImage src={event.driver.avatar} />
                <AvatarFallback className="text-xs">
                  {event.driver.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="text-sm font-medium">
                  {event.driver.name}
                </span>
                {event.driver.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {event.driver.rating}
                    </span>
                  </div>
                )}
              </div>
              {event.seat && (
                <span className="text-xs text-muted-foreground">
                  Seat {event.seat}
                </span>
              )}
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              {event.price && (
                <span className="font-medium">
                  ₴{event.price}
                </span>
              )}
            </div>

            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {event.canRebook && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRebook(event)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Rebook
                </Button>
              )}

              {event.canRate && (
                <Button size="sm" variant="outline">
                  <Star className="w-4 h-4 mr-1" />
                  Rate
                </Button>
              )}

              {isActive && (
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (
    title: string,
    events: HistoryEvent[],
    sectionKey: keyof typeof expandedSections,
  ) => {
    if (events.length === 0) return null;

    const isExpanded = expandedSections[sectionKey];

    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={(open) =>
          setExpandedSections((prev) => ({
            ...prev,
            [sectionKey]: open,
          }))
        }
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "w-full justify-between p-0 h-auto font-medium text-left",
            )}
          >
            <span>
              {title} ({events.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {events.map(renderEventCard)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-semibold">History</h1>
              <p className="text-sm text-muted-foreground">
                All your trips & services
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Service Filter Modal */}
            <Dialog
              open={showServiceFilter}
              onOpenChange={setShowServiceFilter}
            >
              <DialogTrigger>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Services
                  {selectedServices.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs"
                    >
                      {selectedServices.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter by Services</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedServices([])}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedServices(
                          activeServices.map((s) => s.id),
                        )
                      }
                    >
                      Select All
                    </Button>
                  </div>

                  {activeServices.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <div
                        key={service.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(
                            service.id,
                          )}
                          onCheckedChange={() =>
                            handleServiceFilterToggle(
                              service.id,
                            )
                          }
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <ServiceIcon
                            className={`w-4 h-4 ${service.color}`}
                          />
                          <span>{service.name}</span>
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            {service.activeCount} active
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Role Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as UserRole)
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="PASSENGER"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Passenger
            </TabsTrigger>
            <TabsTrigger
              value="DRIVER"
              className="flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Driver
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Search and Calendar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips and services..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-10"
                />
              </div>

              {/* Calendar Filter */}
              <Popover
                open={showCalendar}
                onOpenChange={setShowCalendar}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "default",
                      }),
                      selectedDate
                        ? "bg-primary text-primary-foreground"
                        : "",
                    )}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {selectedDate && (
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDateFilter();
                        }}
                      />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="end"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={{
                      hasEvent: (date: Date) => {
                        return eventDates.some(
                          (eventDate) =>
                            eventDate.toDateString() ===
                            date.toDateString(),
                        );
                      },
                    }}
                    modifiersClassNames={{
                      hasEvent:
                        "bg-primary text-primary-foreground font-bold rounded-full",
                    }}
                    className="rounded-md border"
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateFilter}
                        className="w-full"
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Filters Row */}
            <div className="flex gap-2">
              {/* Status Filter */}
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="CONFIRMED">
                    Confirmed
                  </SelectItem>
                  <SelectItem value="PENDING">
                    Pending
                  </SelectItem>
                  <SelectItem value="COMPLETED">
                    Completed
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    Cancelled
                  </SelectItem>
                  <SelectItem value="NO_SHOW">
                    No Show
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Service Filter */}
              <Dialog
                open={showServiceFilter}
                onOpenChange={setShowServiceFilter}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "default",
                      }),
                      "flex-1",
                    )}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Services
                    {selectedServices.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 text-xs"
                      >
                        {selectedServices.length}
                      </Badge>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Filter by Services
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedServices([])}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedServices(
                            activeServices.map((s) => s.id),
                          )
                        }
                      >
                        Select All
                      </Button>
                    </div>

                    {activeServices.map((service) => {
                      const ServiceIcon = service.icon;
                      return (
                        <div
                          key={service.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(
                              service.id,
                            )}
                            onCheckedChange={() =>
                              handleServiceFilterToggle(
                                service.id,
                              )
                            }
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <ServiceIcon
                              className={`w-4 h-4 ${service.color}`}
                            />
                            <span>{service.name}</span>
                            <Badge
                              variant="secondary"
                              className="text-xs"
                            >
                              {service.activeCount} active
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Active Filters Display */}
            {(selectedDate ||
              selectedStatus !== "all" ||
              selectedServices.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedDate && (
                  <Badge variant="secondary" className="gap-1">
                    Date:{" "}
                    {formatDate(selectedDate.toISOString())}
                    <button onClick={clearDateFilter}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {selectedStatus}
                    <button
                      onClick={() => setSelectedStatus("all")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedServices.map((service) => (
                  <Badge
                    key={service}
                    variant="secondary"
                    className="gap-1"
                  >
                    {serviceConfig[service].name}
                    <button
                      onClick={() =>
                        handleServiceFilterToggle(service)
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Active Services Quick Filter */}
            {activeServices.length > 0 &&
              selectedServices.length === 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {activeServices.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Button
                        key={service.id}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedServices([service.id])
                        }
                        className="flex-shrink-0 gap-1"
                      >
                        <ServiceIcon
                          className={`w-4 h-4 ${service.color}`}
                        />
                        {service.name}
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {service.activeCount}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              )}

            {/* Content Sections */}
            <div className="space-y-6">
              {selectedDate ? (
                // When date filter is active, show all events for that date sorted by time
                <div>
                  <h3 className="font-medium mb-3">
                    Events for{" "}
                    {formatDate(selectedDate.toISOString())} (
                    {filteredEvents.active.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredEvents.active.length > 0 ? (
                      filteredEvents.active.map(renderEventCard)
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          No events on this date
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Normal grouped view
                <>
                  {renderSection(
                    "Active",
                    filteredEvents.active,
                    "active",
                  )}
                  {renderSection(
                    "Past",
                    filteredEvents.past,
                    "past",
                  )}
                  {renderSection(
                    "Cancelled",
                    filteredEvents.cancelled,
                    "cancelled",
                  )}
                </>
              )}
            </div>

            {/* Empty State */}
            {Object.values(filteredEvents).every(
              (arr) => arr.length === 0,
            ) && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">
                  No events found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ||
                  selectedServices.length > 0 ||
                  selectedStatus !== "all" ||
                  selectedDate
                    ? "Try adjusting your search or filters"
                    : `No ${activeTab.toLowerCase()} events yet`}
                </p>
                {!searchQuery &&
                  selectedServices.length === 0 &&
                  selectedStatus === "all" &&
                  !selectedDate && (
                    <Button
                      onClick={() =>
                        navigate("/mobility/carpool/explore")
                      }
                    >
                      Book your first trip
                    </Button>
                  )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PMobCarpoolHistory;