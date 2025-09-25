// Unified Action Model for Home Screen
export type Domain = "mobility" | "care" | "docs" | "city";

export type ActionKind =
  // Mobility
  | "ride_upcoming" 
  | "ride_rate" 
  | "ride_draft"
  | "ride_parking"
  // Care
  | "care_appointment" 
  | "care_parts_pickup" 
  | "care_service_due"
  | "care_mot_due"
  // Docs
  | "docs_insurance_renew" 
  | "docs_fine_pay" 
  | "docs_toll_permit"
  | "docs_license_expiry"
  // City
  | "city_booking" 
  | "city_alert"
  | "city_delivery";

export type ActionStatus = "todo" | "soon" | "overdue" | "done" | "info";

export interface ActionItem {
  id: string;
  domain: Domain;
  kind: ActionKind;
  title: string;          // "Trip Lviv → Krakivets"
  subtitle?: string;      // "Today 18:40 • seat 2/3"
  dueAt?: string;         // ISO date
  status: ActionStatus;
  priority: number;       // 1-10, higher = more urgent
  cta: { 
    label: string; 
    to: string; 
    variant?: "default" | "destructive" | "outline";
  };
  secondary?: { 
    label: string; 
    to: string; 
  }[];
  meta?: Record<string, any>; // ids, plate, orderId, etc.
  badge?: {
    text: string;
    variant: "default" | "destructive" | "warning" | "success";
  };
}

// Priority calculation helpers
export const getDomainPriority = (domain: Domain): number => {
  switch (domain) {
    case "docs": return 10;      // Legal/financial most urgent
    case "mobility": return 8;   // Travel needs
    case "care": return 6;       // Vehicle maintenance
    case "city": return 4;       // Lifestyle/convenience
    default: return 1;
  }
};

export const getStatusPriority = (status: ActionStatus): number => {
  switch (status) {
    case "overdue": return 20;
    case "todo": return 10;
    case "soon": return 5;
    case "info": return 2;
    case "done": return 0;
    default: return 1;
  }
};

export const calculatePriority = (item: ActionItem): number => {
  const statusPrio = getStatusPriority(item.status);
  const domainPrio = getDomainPriority(item.domain);
  
  // Time urgency
  let timeUrgency = 0;
  if (item.dueAt) {
    const now = new Date();
    const dueDate = new Date(item.dueAt);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) timeUrgency = 50; // Overdue
    else if (hoursUntilDue < 24) timeUrgency = 30; // Due today
    else if (hoursUntilDue < 72) timeUrgency = 15; // Due soon
    else timeUrgency = 0;
  }
  
  return statusPrio + domainPrio + timeUrgency + (item.priority || 0);
};

// Selectors
export const selectNextUp = (items: ActionItem[]): ActionItem[] => {
  return items
    .filter(item => ['todo', 'soon', 'overdue'].includes(item.status))
    .sort((a, b) => calculatePriority(b) - calculatePriority(a))
    .slice(0, 3);
};

export const selectByDomain = (items: ActionItem[], domain: Domain): ActionItem[] => {
  return items
    .filter(item => item.domain === domain)
    .sort((a, b) => calculatePriority(b) - calculatePriority(a));
};

export const selectResume = (items: ActionItem[]): ActionItem[] => {
  return items
    .filter(item => item.kind.includes('draft') || item.status === 'info')
    .slice(0, 3);
};