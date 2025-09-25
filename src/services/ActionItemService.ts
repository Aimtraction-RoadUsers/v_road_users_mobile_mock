import { type ActionItem, type Domain} from '../types/ActionItem';

// Mock data service for action items
export class ActionItemService {
  private static instance: ActionItemService;
  
  static getInstance(): ActionItemService {
    if (!ActionItemService.instance) {
      ActionItemService.instance = new ActionItemService();
    }
    return ActionItemService.instance;
  }

  async getAllActions(): Promise<ActionItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return [
      // Mobility Actions
      {
        id: 'trip-today-1',
        domain: 'mobility',
        kind: 'ride_upcoming',
        title: 'Trip Lviv → Krakivets',
        subtitle: 'Today 18:40 • Driver: Andriy • 2/3 seats',
        dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'todo',
        priority: 8,
        cta: { label: 'Open route', to: '/mobility' },
        secondary: [
          { label: 'Chat with driver', to: '/chats/carpool-lviv-kyiv-1' },
          { label: 'Find parking', to: '/mobility/parking?near=krakivets' }
        ],
        badge: { text: 'Today', variant: 'warning' },
        meta: { tripId: 'trip-today-1', driverId: 'andriy-123' }
      },
      {
        id: 'ride-rate-1',
        domain: 'mobility',
        kind: 'ride_rate',
        title: 'Rate completed ride',
        subtitle: 'Kyiv → Odesa with Maria • Yesterday',
        status: 'todo',
        priority: 6,
        cta: { label: 'Rate ride', to: '/mobility/rate/ride-completed-1' },
        secondary: [
          { label: 'Download receipt', to: '/mobility/receipt/ride-completed-1' }
        ],
        meta: { rideId: 'ride-completed-1' }
      },
      {
        id: 'draft-search-1',
        domain: 'mobility',
        kind: 'ride_draft',
        title: 'Unfinished trip search',
        subtitle: 'Lviv → Warsaw • Tomorrow 10:00',
        status: 'info',
        priority: 3,
        cta: { label: 'Complete search', to: '/mobility/search?draft=draft-search-1' },
        meta: { draftId: 'draft-search-1' }
      },

      // Care Actions
      {
        id: 'service-appointment-1',
        domain: 'care',
        kind: 'care_appointment',
        title: 'Oil change appointment',
        subtitle: 'AutoService Plus • Tomorrow 14:00',
        dueAt: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'soon',
        priority: 7,
        cta: { label: 'Open route', to: '/care/appointment/service-appointment-1' },
        secondary: [
          { label: 'Reschedule', to: '/care/reschedule/service-appointment-1' },
          { label: 'Call service', to: 'tel:+380123456789' }
        ],
        badge: { text: 'Tomorrow', variant: 'default' },
        meta: { appointmentId: 'service-appointment-1', serviceId: 'autoservice-plus' }
      },
      {
        id: 'parts-pickup-1',
        domain: 'care',
        kind: 'care_parts_pickup',
        title: 'Brake pads ready for pickup',
        subtitle: 'AutoParts Store • Order #BP-2024-001',
        status: 'todo',
        priority: 5,
        cta: { label: 'Confirm pickup', to: '/care/parts/pickup/parts-pickup-1' },
        meta: { orderId: 'BP-2024-001', storeId: 'autoparts-store' }
      },
      {
        id: 'mot-due-1',
        domain: 'care',
        kind: 'care_service_due',
        title: 'MOT inspection due',
        subtitle: 'Honda Civic • Due in 15 days',
        dueAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'soon',
        priority: 6,
        cta: { label: 'Book MOT', to: '/care/mot/book' },
        badge: { text: 'Due soon', variant: 'warning' },
        meta: { vehicleId: 'honda-civic-1', motDue: '2025-02-10' }
      },

      // Docs Actions
      {
        id: 'insurance-renew-1',
        domain: 'docs',
        kind: 'docs_insurance_renew',
        title: 'Car insurance expires soon',
        subtitle: 'Honda Civic • Valid until 30.09.2025',
        dueAt: new Date('2025-09-30').toISOString(),
        status: 'soon',
        priority: 9,
        cta: { label: 'Compare offers', to: '/docs/insurance/renew' },
        secondary: [
          { label: 'Current policy', to: '/docs/insurance/current' }
        ],
        badge: { text: 'Expires 30.09', variant: 'warning' },
        meta: { vehicleId: 'honda-civic-1', policyId: 'INS-2024-001' }
      },
      {
        id: 'fine-pay-1',
        domain: 'docs',
        kind: 'docs_fine_pay',
        title: 'Traffic fine',
        subtitle: 'Speeding • ₴680 • Due in 3 days',
        dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'todo',
        priority: 10,
        cta: { label: 'Pay now', to: '/docs/fines/pay/fine-pay-1', variant: 'destructive' },
        secondary: [
          { label: 'View details', to: '/docs/fines/fine-pay-1' }
        ],
        badge: { text: 'Due in 3 days', variant: 'destructive' },
        meta: { fineId: 'fine-pay-1', amount: 680 }
      },
      {
        id: 'toll-permit-1',
        domain: 'docs',
        kind: 'docs_toll_permit',
        title: 'Toll permit for today\'s route',
        subtitle: 'Lviv → Krakivets via A4',
        dueAt: new Date().toISOString(),
        status: 'todo',
        priority: 7,
        cta: { label: 'Buy permit', to: '/docs/tolls/buy?route=lviv-krakivets' },
        badge: { text: 'Today', variant: 'warning' },
        meta: { routeId: 'lviv-krakivets', tollAmount: 25 }
      },

      // City Actions
      {
        id: 'tow-booking-1',
        domain: 'city',
        kind: 'city_booking',
        title: 'Recent: Tow truck search',
        subtitle: 'AutoHelp • 25 min ETA • ₴1200',
        status: 'info',
        priority: 2,
        cta: { label: 'Call again', to: 'tel:+380987654321' },
        secondary: [
          { label: 'Save contact', to: '/city/contacts/save?id=autohelp' }
        ],
        meta: { serviceId: 'autohelp', providerId: 'tow-truck-1' }
      },
      {
        id: 'road-alert-1',
        domain: 'city',
        kind: 'city_alert',
        title: 'Road closure on your route',
        subtitle: 'Lviv → Krakivets • Detour +15 min',
        status: 'info',
        priority: 4,
        cta: { label: 'Map details', to: '/city/map?alert=road-alert-1' },
        badge: { text: 'Live', variant: 'destructive' },
        meta: { alertId: 'road-alert-1', routeImpact: 15 }
      },
      {
        id: 'delivery-track-1',
        domain: 'city',
        kind: 'city_delivery',
        title: 'Package delivery',
        subtitle: 'Nova Poshta • Arriving today 16:00',
        dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        status: 'soon',
        priority: 3,
        cta: { label: 'Track package', to: '/city/delivery/track/delivery-track-1' },
        badge: { text: 'Today 16:00', variant: 'default' },
        meta: { trackingId: 'NP20250121001', courier: 'nova-poshta' }
      }
    ];
  }

  async getActionsByDomain(domain: Domain): Promise<ActionItem[]> {
    const allActions = await this.getAllActions();
    return allActions.filter(action => action.domain === domain);
  }

  async markActionComplete(actionId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Action ${actionId} marked as complete`);
  }

  async dismissAction(actionId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Action ${actionId} dismissed`);
  }
}

export const actionItemService = ActionItemService.getInstance();