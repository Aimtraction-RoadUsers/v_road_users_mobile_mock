import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Car,
  AlertTriangle,
  Wrench,
  Shield,
  ShoppingCart,
  Ellipsis,
  ParkingSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CMPBottomSheet from "./cmpBottomSheet";
import CMPShortcutGrid from "./cmpShortcutGrid";
import CMPBadge from "./cmpBadge";
import type {
  ActionButton,
  ShortcutChipItem,
} from "./types_ui";

type Props = {
  actions?: ActionButton[];
  shortcuts?: ShortcutChipItem[];
  onRunShortcut?: (id: string) => void; // navigation / side effects
};

export default function CMPFloatingActionButton({
  onRunShortcut,
  shortcuts = [
    { id: "fines", label: "Fines", icon: AlertTriangle },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "repair", label: "Repair", icon: Wrench },
    { id: "parking", label: "Parking", icon: ParkingSquare },
  ],
}: Props) {
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(
    null,
  );
  const [pending, setPending] = useState(0); // badge number

  const actionButtons = [
    {
      id: "vPidsadka",
      label: "vPidsadka",
      icon: Car,
      color: "bg-blue-500",
    },
    {
      id: "vInformer",
      label: "Informer",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      id: "repair",
      label: "Repair",
      icon: Wrench,
      color: "bg-orange-500",
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      id: "more",
      label: "...More",
      icon: Ellipsis,
      color: "bg-black",
    },
  ];

  const handleActionClick = (actionId: string) => {
    if (actionId === "more") {
      console.log(`Clicked: ${actionId === "more"}`);
      setIsDialOpen(false);
      setIsSheetOpen(true);
      return;
    }
    // handle other quick actions here
    setIsDialOpen(false);
  };

  const handleChipSelect = (chipId: string) => {
    setActiveChip(chipId);
    onRunShortcut?.(chipId); // parent callback for navigation
  };

  // ESC closes sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <CMPBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Shortcuts"
      >
        <CMPShortcutGrid
          items={shortcuts}
          activeId={activeChip}
          onSelect={handleChipSelect}
        />
      </CMPBottomSheet>
      <div className="fixed bottom-20 right-4 z-50">
        {/* Action Buttons */}
        <AnimatePresence>
          {isDialOpen && (
            <div className="flex flex-col items-end space-y-3 mb-4">
              {actionButtons.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      y: 20,
                      transition: {
                        delay:
                          (actionButtons.length - index - 1) *
                          0.05,
                      },
                    }}
                    onClick={() => handleActionClick(action.id)}
                    className={`${action.color} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow flex items-center`}
                  >
                    <span className="mr-3 text-sm whitespace-nowrap bg-white text-gray-800 px-2 py-1 rounded">
                      {action.label}
                    </span>
                    <Icon className="h-5 w-5" />
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => {
            setIsDialOpen(!isDialOpen);
            setPending((n) => n + 1); // ⬅️ bump the number
          }}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isDialOpen ? 45 : 0 }}
        >
          {isDialOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
          <CMPBadge
            count={pending}
            max={99}
            position="top-right"
          />
        </motion.button>
      </div>
    </div>
  );
}