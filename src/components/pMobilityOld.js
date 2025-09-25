import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* ----------------------------
   Тут прості квардратики без пошуку
----------------------------- */
import { useState } from "react";
import { Car, Route, MapPinned, KeyRound, Wallet, Bus, Bike, ShoppingCart, } from "lucide-react";
const MOBILITY_GROUPS = [
    {
        id: "rides",
        title: "Rides & Sharing",
        subtitle: "Find or request rides for you or your group.",
        items: [
            {
                id: "vPidsadka",
                label: "vPidsadka",
                icon: Car,
                description: "Share rides with trusted drivers or offer your seat.",
                badge: "💰 Твій заробіток",
            },
            {
                id: "vTaxiRequests",
                label: "Taxi Requests",
                icon: Car,
                description: "Request a taxi where big apps may not operate.",
                badge: "💰 Твій заробіток",
            },
            {
                id: "vScooters",
                label: "Scooters",
                icon: Bike,
                description: "Locate and unlock shared scooters.",
            },
            {
                id: "vSharing",
                label: "Vehicle sharing",
                icon: Bike,
                description: "Locate and unlock shared scooters.",
                badge: "💰 Твій заробіток",
            },
        ],
    },
    {
        id: "planning",
        title: "Planning & Navigation",
        subtitle: "Plan routes and manage parking on the go.",
        items: [
            {
                id: "tripPlanner",
                label: "Trip Planner",
                icon: Route,
                description: "Plan multi-stop routes and optimize travel.",
            },
            {
                id: "parking",
                label: "Parking",
                icon: MapPinned,
                description: "Search, book, and pay. Find garages nearby.",
            },
        ],
    },
    {
        id: "access",
        title: "Vehicle Access",
        subtitle: "Short- and long-term access to vehicles.",
        items: [
            {
                id: "vCarRental",
                label: "Car Rental",
                icon: KeyRound,
                description: "Rent cars short- or long-term.",
            },
            {
                id: "vLeasing",
                label: "Leasing",
                icon: Wallet,
                description: "Explore leasing offers for individuals and businesses.",
            },
        ],
    },
    {
        id: "charter",
        title: "Transport & Charter",
        subtitle: "Book buses, vans, or trucks for events and goods.",
        items: [
            {
                id: "vTransport",
                label: "Transport Booking",
                icon: Bus,
                description: "Charter vehicles for guests or cargo.",
                badge: "💰 Твій заробіток",
            },
        ],
    },
    {
        id: "market",
        title: "Vehicle Marketplace",
        subtitle: "Buy, sell, or exchange vehicles and parts.",
        items: [
            {
                id: "vMarketplace",
                label: "Marketplace",
                icon: ShoppingCart,
                description: "Cars, bikes, and spare parts.",
                badge: "💰 Твій заробіток",
            },
        ],
    },
];
/* ----------------------------
   2) CARD ITEM (replaces chips)
----------------------------- */
function ItemCard({ item, selected, onSelect, fullWidth = false, }) {
    const Icon = item.icon;
    return (_jsxs("button", { type: "button", onClick: () => onSelect(item.id), className: [
            "relative", // <-- обов'язково! робимо батька відносним
            "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
            "transition hover:bg-accent hover:text-accent-foreground",
            "p-4 text-center",
            selected ? "ring-2 ring-primary/40" : "",
            fullWidth ? "w-full" : "w-full",
        ].join(" "), children: [item.badge && (_jsx("span", { className: "absolute top-2 right-2 bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full text-[0.52em]", children: item.badge })), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx(Icon, { className: "h-6 w-6 mb-2 text-foreground/80" }), _jsx("div", { className: "text-sm font-medium text-foreground", children: item.label }), item.description && (_jsx("p", { className: "mt-1 text-xs text-muted-foreground max-w-[260px]", children: item.description }))] })] }));
}
/* ----------------------------
   3) GROUP CARD
----------------------------- */
function GroupCard({ group, activeId, onSelect, collapsible = true, defaultOpen = true, }) {
    const [open, setOpen] = useState(defaultOpen);
    const single = group.items.length === 1;
    return (_jsxs("div", { className: "rounded-2xl border border-border bg-card text-card-foreground p-4 shadow-sm text-center", children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("h3", { className: "text-base font-semibold text-foreground", children: group.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: group.subtitle }), collapsible && (_jsx("button", { type: "button", onClick: () => setOpen(!open), className: "text-sm px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent", "aria-expanded": open, children: open ? "Hide" : "Show" }))] }), open && (_jsx("div", { className: [
                    "mt-4 grid gap-4 justify-items-center",
                    single ? "grid-cols-1" : "grid-cols-2",
                ].join(" "), children: group.items.map((item) => (_jsx(ItemCard, { item: item, selected: activeId === item.id, onSelect: onSelect, fullWidth: single }, item.id))) }))] }));
}
/* ----------------------------
   4) Mobility Catalog (full section)
----------------------------- */
export function SECMobilityCatalog({ onSelect, }) {
    const [activeId, setActiveId] = useState(null);
    const handleSelect = (id) => {
        setActiveId(id);
        onSelect?.(id); // navigate / open flow
    };
    return (_jsx("div", { className: "max-w-md mx-auto px-4 space-y-4", children: MOBILITY_GROUPS.map((group) => (_jsx(GroupCard, { group: group, activeId: activeId, onSelect: handleSelect, collapsible: true, defaultOpen: true }, group.id))) }));
}
