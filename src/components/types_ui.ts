// src/types/ui.ts
export type IconType = React.ElementType;

export type ActionButton = {
  id: string;
  label: string;
  icon: IconType;
  colorClass: string; // e.g., "bg-blue-500"
};

export type ShortcutChipItem = {
  id: string;
  label: string;
  icon: IconType;
};