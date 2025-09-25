import {
  Home,
  Search,
  Star,
  MessageCircle,
  Clock,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import DoubleTapNavLink from "../cmpDoubleTapNavLink";

export default function CarpoolBottomNav() {
  const tabs = [
    {
      to: "/mobility/carpool/explore",
      icon: <Search className="h-6 w-6" />,
      label: "Explore",
    },
    {
      to: "/mobility/carpool/favourite",
      icon: <Star className="h-6 w-6" />,
      label: "Favourite",
    },
    {
      to: "/mobility/carpool/home",
      icon: <Home className="h-6 w-6" />,
      label: "Home",
      isHome: true,
    },
    {
      to: "/mobility/carpool/chats",
      icon: <MessageCircle className="h-6 w-6" />,
      label: "Chats",
    },
    {
      to: "/mobility/carpool/history",
      icon: <Clock className="h-6 w-6" />,
      label: "History",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t flex justify-around py-2">
      {tabs.map(({ to, icon, label, isHome }) =>
        isHome ? (
          <DoubleTapNavLink
            key={to}
            primaryTo={to} // одиночний тап → локальний home
            secondaryTo="/" // подвійний тап → глобальний home
            className="flex flex-col items-center text-sm"
          >
            {icon}
            <span className="text-xs">{label}</span>
          </DoubleTapNavLink>
        ) : (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-sm ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`
            }
          >
            {icon}
            <span className="text-xs">{label}</span>
          </NavLink>
        ),
      )}
    </nav>
  );
}