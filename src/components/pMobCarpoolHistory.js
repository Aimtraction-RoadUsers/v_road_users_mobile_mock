import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { cn } from "./ui/utils";
import { Clock, Car, Bus, Train, Star, RotateCcw, AlertCircle, CheckCircle, XCircle, Filter, Search, Shield, Wrench, User, UserCheck, ChevronDown, ChevronUp, Calendar as CalendarIcon, MapPin, ExternalLink, X, } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage, } from "./ui/avatar";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger, } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible";
import { useNavigate } from "react-router-dom";
// Mock comprehensive data across all services
const mockHistoryEvents = [
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
const serviceConfig = {
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
function getStatusColor(status) {
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
function getStatusIcon(status) {
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
function getProviderName(provider) {
    const providers = {
        vp: "vPoputku",
        flix: "FlixBus",
        udz: "Ukrainian Railways",
        autoservice: "AutoService",
        pzu: "PZU Insurance",
    };
    return providers[provider] || provider;
}
const PMobCarpoolHistory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("PASSENGER");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [showServiceFilter, setShowServiceFilter] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [sortMode, setSortMode] = useState("time");
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
            const matchesSearch = !searchQuery ||
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
            const matchesService = selectedServices.length === 0 ||
                selectedServices.includes(event.service);
            const matchesStatus = selectedStatus === "all" ||
                event.status === selectedStatus;
            const matchesDate = !selectedDate ||
                new Date(event.date).toDateString() ===
                    selectedDate.toDateString();
            return (matchesRole &&
                matchesSearch &&
                matchesService &&
                matchesStatus &&
                matchesDate);
        });
        // If date filter is active, sort by time instead of grouping by status
        if (selectedDate) {
            const sortByTime = (a, b) => {
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
        const active = events.filter((e) => ["ACTIVE", "CONFIRMED", "PENDING"].includes(e.status));
        const past = events.filter((e) => e.status === "COMPLETED");
        const cancelled = events.filter((e) => ["CANCELLED", "NO_SHOW"].includes(e.status));
        // Sort within each group
        const sortByTime = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();
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
        const counts = {};
        mockHistoryEvents
            .filter((event) => event.role === activeTab &&
            ["ACTIVE", "CONFIRMED", "PENDING"].includes(event.status))
            .forEach((event) => {
            counts[event.service] =
                (counts[event.service] || 0) + 1;
        });
        return Object.entries(serviceConfig)
            .filter(([service]) => counts[service] > 0)
            .map(([service, config]) => ({
            ...config,
            activeCount: counts[service] || 0,
        }));
    }, [activeTab]);
    const handleServiceFilterToggle = (service) => {
        setSelectedServices((prev) => prev.includes(service)
            ? prev.filter((s) => s !== service)
            : [...prev, service]);
    };
    const handleEventClick = (event) => {
        if (event.deepLink) {
            navigate(event.deepLink);
        }
    };
    const handleRebook = (event) => {
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
    const formatDate = (dateISO) => {
        const date = new Date(dateISO);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() ===
            new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
        if (isToday)
            return "Today";
        if (isTomorrow)
            return "Tomorrow";
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
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };
    const renderEventCard = (event) => {
        const ServiceIcon = serviceConfig[event.service].icon;
        const StatusIcon = getStatusIcon(event.status);
        const isActive = [
            "ACTIVE",
            "CONFIRMED",
            "PENDING",
        ].includes(event.status);
        return (_jsx(Card, { className: `cursor-pointer hover:bg-accent/50 ${isActive ? "border-l-4 border-l-primary" : ""}`, onClick: () => handleEventClick(event), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ServiceIcon, { className: `w-5 h-5 ${serviceConfig[event.service].color}` }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: event.title }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [getProviderName(event.provider), event.bookingCode &&
                                                        ` • ${event.bookingCode}`] })] })] }), _jsxs(Badge, { className: getStatusColor(event.status), children: [_jsx(StatusIcon, { className: "w-3 h-3 mr-1" }), event.status] })] }), _jsxs("div", { className: "space-y-2 mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CalendarIcon, { className: "w-4 h-4 text-muted-foreground" }), _jsx("span", { children: formatDate(event.date) }), event.time && _jsxs("span", { children: ["at ", event.time] })] }), event.from && event.to && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("span", { children: [event.from, " \u2192 ", event.to] })] })), event.location && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 text-muted-foreground" }), _jsx("span", { children: event.location })] })), event.description && (_jsx("p", { className: "text-sm text-muted-foreground", children: event.description }))] }), event.driver && (_jsxs("div", { className: "flex items-center gap-3 mb-3 p-2 bg-muted rounded-lg", children: [_jsxs(Avatar, { className: "w-6 h-6", children: [_jsx(AvatarImage, { src: event.driver.avatar }), _jsx(AvatarFallback, { className: "text-xs", children: event.driver.name.charAt(0) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("span", { className: "text-sm font-medium", children: event.driver.name }), event.driver.rating && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "text-xs text-muted-foreground", children: event.driver.rating })] }))] }), event.seat && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Seat ", event.seat] }))] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { children: event.price && (_jsxs("span", { className: "font-medium", children: ["\u20B4", event.price] })) }), _jsxs("div", { className: "flex gap-2", onClick: (e) => e.stopPropagation(), children: [event.canRebook && (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleRebook(event), children: [_jsx(RotateCcw, { className: "w-4 h-4 mr-1" }), "Rebook"] })), event.canRate && (_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Star, { className: "w-4 h-4 mr-1" }), "Rate"] })), isActive && (_jsx(Button, { size: "sm", variant: "outline", children: _jsx(ExternalLink, { className: "w-4 h-4" }) }))] })] })] }) }, event.id));
    };
    const renderSection = (title, events, sectionKey) => {
        if (events.length === 0)
            return null;
        const isExpanded = expandedSections[sectionKey];
        return (_jsxs(Collapsible, { open: isExpanded, onOpenChange: (open) => setExpandedSections((prev) => ({
                ...prev,
                [sectionKey]: open,
            })), children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: cn(buttonVariants({
                            variant: "ghost",
                            size: "default",
                        }), "w-full justify-between p-0 h-auto font-medium text-left"), children: [_jsxs("span", { children: [title, " (", events.length, ")"] }), isExpanded ? (_jsx(ChevronUp, { className: "w-4 h-4" })) : (_jsx(ChevronDown, { className: "w-4 h-4" }))] }) }), _jsx(CollapsibleContent, { className: "space-y-3 mt-3", children: events.map(renderEventCard) })] }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "sticky top-0 z-50 bg-background border-b border-border px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold", children: "History" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "All your trips & services" })] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Dialog, { open: showServiceFilter, onOpenChange: setShowServiceFilter, children: [_jsx(DialogTrigger, { children: _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Filter, { className: "w-4 h-4 mr-1" }), "Services", selectedServices.length > 0 && (_jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: selectedServices.length }))] }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Filter by Services" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedServices([]), children: "Reset" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedServices(activeServices.map((s) => s.id)), children: "Select All" })] }), activeServices.map((service) => {
                                                        const ServiceIcon = service.icon;
                                                        return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: service.id, checked: selectedServices.includes(service.id), onCheckedChange: () => handleServiceFilterToggle(service.id) }), _jsxs("div", { className: "flex items-center gap-2 flex-1", children: [_jsx(ServiceIcon, { className: `w-4 h-4 ${service.color}` }), _jsx("span", { children: service.name }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [service.activeCount, " active"] })] })] }, service.id));
                                                    })] })] })] }) })] }) }), _jsx("div", { className: "p-4", children: _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-4", children: [_jsxs(TabsTrigger, { value: "PASSENGER", className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4" }), "Passenger"] }), _jsxs(TabsTrigger, { value: "DRIVER", className: "flex items-center gap-2", children: [_jsx(UserCheck, { className: "w-4 h-4" }), "Driver"] })] }), _jsxs(TabsContent, { value: activeTab, className: "space-y-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search trips and services...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs(Popover, { open: showCalendar, onOpenChange: setShowCalendar, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: cn(buttonVariants({
                                                            variant: "outline",
                                                            size: "default",
                                                        }), selectedDate
                                                            ? "bg-primary text-primary-foreground"
                                                            : ""), children: [_jsx(CalendarIcon, { className: "w-4 h-4" }), selectedDate && (_jsx(X, { className: "w-3 h-3 ml-1", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    clearDateFilter();
                                                                } }))] }) }), _jsxs(PopoverContent, { className: "w-auto p-0", align: "end", children: [_jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: handleDateSelect, modifiers: {
                                                                hasEvent: (date) => {
                                                                    return eventDates.some((eventDate) => eventDate.toDateString() ===
                                                                        date.toDateString());
                                                                },
                                                            }, modifiersClassNames: {
                                                                hasEvent: "bg-primary text-primary-foreground font-bold rounded-full",
                                                            }, className: "rounded-md border", initialFocus: true }), selectedDate && (_jsx("div", { className: "p-3 border-t", children: _jsx(Button, { variant: "outline", size: "sm", onClick: clearDateFilter, className: "w-full", children: "Clear filter" }) }))] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedStatus, onValueChange: setSelectedStatus, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "All statuses" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Statuses" }), _jsx(SelectItem, { value: "ACTIVE", children: "Active" }), _jsx(SelectItem, { value: "CONFIRMED", children: "Confirmed" }), _jsx(SelectItem, { value: "PENDING", children: "Pending" }), _jsx(SelectItem, { value: "COMPLETED", children: "Completed" }), _jsx(SelectItem, { value: "CANCELLED", children: "Cancelled" }), _jsx(SelectItem, { value: "NO_SHOW", children: "No Show" })] })] }), _jsxs(Dialog, { open: showServiceFilter, onOpenChange: setShowServiceFilter, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: cn(buttonVariants({
                                                            variant: "outline",
                                                            size: "default",
                                                        }), "flex-1"), children: [_jsx(Filter, { className: "w-4 h-4 mr-1" }), "Services", selectedServices.length > 0 && (_jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: selectedServices.length }))] }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Filter by Services" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedServices([]), children: "Reset" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedServices(activeServices.map((s) => s.id)), children: "Select All" })] }), activeServices.map((service) => {
                                                                    const ServiceIcon = service.icon;
                                                                    return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: service.id, checked: selectedServices.includes(service.id), onCheckedChange: () => handleServiceFilterToggle(service.id) }), _jsxs("div", { className: "flex items-center gap-2 flex-1", children: [_jsx(ServiceIcon, { className: `w-4 h-4 ${service.color}` }), _jsx("span", { children: service.name }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [service.activeCount, " active"] })] })] }, service.id));
                                                                })] })] })] })] }), (selectedDate ||
                                    selectedStatus !== "all" ||
                                    selectedServices.length > 0) && (_jsxs("div", { className: "flex flex-wrap gap-2", children: [selectedDate && (_jsxs(Badge, { variant: "secondary", className: "gap-1", children: ["Date:", " ", formatDate(selectedDate.toISOString()), _jsx("button", { onClick: clearDateFilter, children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedStatus !== "all" && (_jsxs(Badge, { variant: "secondary", className: "gap-1", children: ["Status: ", selectedStatus, _jsx("button", { onClick: () => setSelectedStatus("all"), children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedServices.map((service) => (_jsxs(Badge, { variant: "secondary", className: "gap-1", children: [serviceConfig[service].name, _jsx("button", { onClick: () => handleServiceFilterToggle(service), children: _jsx(X, { className: "w-3 h-3" }) })] }, service)))] })), activeServices.length > 0 &&
                                    selectedServices.length === 0 && (_jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: activeServices.map((service) => {
                                        const ServiceIcon = service.icon;
                                        return (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setSelectedServices([service.id]), className: "flex-shrink-0 gap-1", children: [_jsx(ServiceIcon, { className: `w-4 h-4 ${service.color}` }), service.name, _jsx(Badge, { variant: "secondary", className: "text-xs", children: service.activeCount })] }, service.id));
                                    }) })), _jsx("div", { className: "space-y-6", children: selectedDate ? (
                                    // When date filter is active, show all events for that date sorted by time
                                    _jsxs("div", { children: [_jsxs("h3", { className: "font-medium mb-3", children: ["Events for", " ", formatDate(selectedDate.toISOString()), " (", filteredEvents.active.length, ")"] }), _jsx("div", { className: "space-y-3", children: filteredEvents.active.length > 0 ? (filteredEvents.active.map(renderEventCard)) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(CalendarIcon, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }), _jsx("p", { className: "text-muted-foreground", children: "No events on this date" })] })) })] })) : (
                                    // Normal grouped view
                                    _jsxs(_Fragment, { children: [renderSection("Active", filteredEvents.active, "active"), renderSection("Past", filteredEvents.past, "past"), renderSection("Cancelled", filteredEvents.cancelled, "cancelled")] })) }), Object.values(filteredEvents).every((arr) => arr.length === 0) && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Clock, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "font-medium mb-2", children: "No events found" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: searchQuery ||
                                                selectedServices.length > 0 ||
                                                selectedStatus !== "all" ||
                                                selectedDate
                                                ? "Try adjusting your search or filters"
                                                : `No ${activeTab.toLowerCase()} events yet` }), !searchQuery &&
                                            selectedServices.length === 0 &&
                                            selectedStatus === "all" &&
                                            !selectedDate && (_jsx(Button, { onClick: () => navigate("/mobility/carpool/explore"), children: "Book your first trip" }))] }))] })] }) })] }));
};
export default PMobCarpoolHistory;
