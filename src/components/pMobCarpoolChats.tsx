import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageCircle, 
  Car, 
  Bus, 
  Train, 
  Shield, 
  Wrench,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Star,

  Users,
  CheckCircle,
  Settings,
  Send,
  Paperclip,
  MoreVertical,
  Volume2,
  X,
  Timer,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { 
  chatEligibilityService, 
  type Role, 
  type ChatContext, 
  type RfqStatus,
  type ChatState,
  type ClosedReason
} from '../services/ChatEligibilityService';

// Types
type ServiceType = 'carpool' | 'bus' | 'train' | 'sto' | 'insurance' | 'parking' | 'fuel';
type MessageType = 'text' | 'system' | 'askall' | 'attachment' | 'offer' | 'selection';
type AudienceType = 'all' | 'applicants' | 'confirmed' | 'personal' | 'system' | 'broadcast' | 'direct';
type UserRole = 'driver' | 'passenger' | 'service_client' | 'service_provider';

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  audience: AudienceType;
  timestamp: string;
  isRead: boolean;
  replyTo?: string;
  attachments?: string[];
  systemEvent?: string;
  askAllData?: {
    title: string;
    options: string[];
    responses?: { userId: string; response: string }[];
  };
}

interface ChatThread {
  id: string;
  service: ServiceType;
  title: string;
  subtitle: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  participants: ChatParticipant[];
  userRole: UserRole;
  context: ChatContext;
  state: ChatState;
  closedReason?: ClosedReason;
  closedAt?: string;
  archivedAt?: string;
  lastEventAt: string;
  metadata: {
    rideId?: string;
    bookingId?: string;
    requestId?: string;
    route?: string;
    date?: string;
    status?: string;
    rfqStatus?: RfqStatus;
    selectedProviderId?: string;
    currentUserId?: string;
  };
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'driver' | 'passenger' | 'applicant' | 'service_provider';
  status: 'confirmed' | 'pending' | 'declined' | 'selected' | 'not_selected';
  seats?: number;
  rating?: number;
  offer?: {
    price?: number;
    eta?: string;
    description?: string;
  };
}

interface ServiceGroup {
  service: ServiceType;
  name: string;
  icon: any;
  color: string;
  threads: ChatThread[];
  unreadCount: number;
}

// Mock data
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    chatId: 'carpool-lviv-kyiv-1',
    senderId: 'driver-1',
    senderName: 'Andriy P.',
    senderAvatar: '',
    type: 'text',
    content: "We're leaving on time at 18:30, meeting at the train station 🚉",
    audience: 'all',
    timestamp: '2025-01-21T16:30:00Z',
    isRead: true
  },
  {
    id: '2',
    chatId: 'carpool-lviv-kyiv-1',
    senderId: 'passenger-1',
    senderName: 'Ihor K.',
    type: 'text',
    content: "I'll be there in 5 min.",
    audience: 'personal',
    timestamp: '2025-01-21T16:35:00Z',
    isRead: false
  },
  {
    id: '3',
    chatId: 'carpool-lviv-kyiv-1',
    senderId: 'system',
    senderName: 'System',
    type: 'system',
    content: 'New request from Olha (2 seats).',
    audience: 'system',
    timestamp: '2025-01-21T16:40:00Z',
    isRead: false,
    systemEvent: 'applicant.created'
  }
];

const mockThreads: ChatThread[] = [
  {
    id: 'carpool-lviv-kyiv-1',
    service: 'carpool',
    title: 'Lviv → Kyiv',
    subtitle: 'Today, 18:30 • 3 confirmed, 1 applicant',
    lastMessage: mockMessages[2],
    unreadCount: 2,
    userRole: 'driver',
    state: 'active',
    lastEventAt: '2025-01-21T16:40:00Z',
    context: {
      domain: 'carpool',
      rideId: 'ride-123',
      isOwnerDriver: true,
      state: 'active'
    },
    participants: [
      { id: 'p1', name: 'Ihor K.', role: 'passenger', status: 'confirmed', seats: 1, rating: 4.8 },
      { id: 'p2', name: 'Yevhen M.', role: 'passenger', status: 'confirmed', seats: 1, rating: 4.9 },
      { id: 'p3', name: 'Olha S.', role: 'applicant', status: 'pending', seats: 2 }
    ],
    metadata: {
      rideId: 'ride-123',
      route: 'Lviv → Kyiv',
      date: '2025-01-21',
      status: 'active',
      currentUserId: 'current-driver'
    }
  },
  {
    id: 'carpool-kyiv-odesa-1',
    service: 'carpool',
    title: 'Kyiv → Odesa',
    subtitle: 'Tomorrow, 09:15 • Pending confirmation',
    lastMessage: {
      id: '4',
      chatId: 'carpool-kyiv-odesa-1',
      senderId: 'system',
      senderName: 'System',
      type: 'system',
      content: 'Your request was sent to the driver. You can message in 04:32.',
      audience: 'system',
      timestamp: '2025-01-21T15:20:00Z',
      isRead: true
    },
    unreadCount: 1,
    userRole: 'passenger',
    state: 'active',
    lastEventAt: '2025-01-21T15:20:00Z',
    context: {
      domain: 'carpool',
      rideId: 'ride-124',
      passengerStatus: 'applicant',
      applicantAppliedAt: '2025-01-21T15:20:00Z',
      applicantMessageDelaySec: 300,
      state: 'active'
    },
    participants: [
      { id: 'd1', name: 'Maria L.', role: 'driver', status: 'confirmed', rating: 4.7 }
    ],
    metadata: {
      rideId: 'ride-124',
      route: 'Kyiv → Odesa',
      date: '2025-01-22',
      status: 'pending',
      currentUserId: 'current-passenger'
    }
  },
  {
    id: 'bus-kyiv-warsaw-1',
    service: 'bus',
    title: 'Kyiv → Warsaw',
    subtitle: 'FlixBus • Booking confirmed',
    lastMessage: {
      id: '5',
      chatId: 'bus-kyiv-warsaw-1',
      senderId: 'system',
      senderName: 'FlixBus',
      type: 'system',
      content: 'Your seat reservation is confirmed. Seat 12A.',
      audience: 'system',
      timestamp: '2025-01-20T14:00:00Z',
      isRead: true,
      systemEvent: 'booking.created'
    },
    unreadCount: 0,
    userRole: 'passenger',
    state: 'active',
    lastEventAt: '2025-01-20T14:00:00Z',
    context: {
      domain: 'service',
      requestId: 'bus-request-1',
      rfqStatus: 'closed',
      state: 'active'
    },
    participants: [],
    metadata: {
      bookingId: 'fb-456',
      route: 'Kyiv → Warsaw',
      date: '2025-01-25',
      status: 'confirmed',
      currentUserId: 'current-passenger'
    }
  },
  {
    id: 'sto-oil-change-1',
    service: 'sto',
    title: 'Oil Change Service',
    subtitle: 'Collecting offers • 3 providers responded',
    lastMessage: {
      id: '6',
      chatId: 'sto-oil-change-1',
      senderId: 'provider-3',
      senderName: 'AutoMax Service',
      type: 'offer',
      content: 'I can do it today for ₴800 with Mobil 1 oil. ETA: 1 hour.',
      audience: 'direct',
      timestamp: '2025-01-21T14:30:00Z',
      isRead: false
    },
    unreadCount: 2,
    userRole: 'service_client',
    state: 'active',
    lastEventAt: '2025-01-21T14:30:00Z',
    context: {
      domain: 'service',
      requestId: 'sto-request-1',
      rfqStatus: 'collecting',
      currentUserId: 'current-client',
      state: 'active'
    },
    participants: [
      { 
        id: 'provider-1', 
        name: 'AutoService Plus', 
        role: 'service_provider', 
        status: 'pending',
        rating: 4.6,
        offer: { price: 950, eta: '2 hours', description: 'Full synthetic oil change + filter' }
      },
      { 
        id: 'provider-2', 
        name: 'Quick Lube', 
        role: 'service_provider', 
        status: 'pending',
        rating: 4.3,
        offer: { price: 750, eta: '30 min', description: 'Standard oil change' }
      },
      { 
        id: 'provider-3', 
        name: 'AutoMax Service', 
        role: 'service_provider', 
        status: 'pending',
        rating: 4.8,
        offer: { price: 800, eta: '1 hour', description: 'Mobil 1 synthetic oil + new filter' }
      }
    ],
    metadata: {
      requestId: 'sto-request-1',
      status: 'collecting',
      rfqStatus: 'collecting',
      currentUserId: 'current-client'
    }
  },
  {
    id: 'insurance-claim-1',
    service: 'insurance',
    title: 'Car Insurance Claim',
    subtitle: 'Provider selected • AutoExpert',
    lastMessage: {
      id: '7',
      chatId: 'insurance-claim-1',
      senderId: 'provider-selected',
      senderName: 'AutoExpert Adjuster',
      type: 'text',
      content: 'I can inspect your car tomorrow at 10 AM. Location confirmed.',
      audience: 'direct',
      timestamp: '2025-01-21T13:15:00Z',
      isRead: false
    },
    unreadCount: 1,
    userRole: 'service_client',
    state: 'active',
    lastEventAt: '2025-01-21T13:15:00Z',
    context: {
      domain: 'service',
      requestId: 'insurance-request-1',
      rfqStatus: 'provider_selected',
      selectedProviderId: 'provider-selected',
      currentUserId: 'current-client',
      state: 'active'
    },
    participants: [
      { 
        id: 'provider-selected', 
        name: 'AutoExpert Adjuster', 
        role: 'service_provider', 
        status: 'selected',
        rating: 4.9,
        offer: { price: 0, eta: 'Tomorrow 10 AM', description: 'Professional damage assessment' }
      }
    ],
    metadata: {
      requestId: 'insurance-request-1',
      status: 'provider_selected',
      rfqStatus: 'provider_selected',
      selectedProviderId: 'provider-selected',
      currentUserId: 'current-client'
    }
  },
  // CLOSED CHATS
  {
    id: 'carpool-completed-1',
    service: 'carpool',
    title: 'Lviv → Krakivets',
    subtitle: 'Yesterday, 18:30 • Completed',
    lastMessage: {
      id: '8',
      chatId: 'carpool-completed-1',
      senderId: 'system',
      senderName: 'System',
      type: 'system',
      content: 'Ride completed successfully.',
      audience: 'system',
      timestamp: '2025-01-20T20:30:00Z',
      isRead: true
    },
    unreadCount: 0,
    userRole: 'passenger',
    state: 'closed',
    closedReason: 'completed',
    closedAt: '2025-01-20T20:30:00Z',
    lastEventAt: '2025-01-20T20:30:00Z',
    context: {
      domain: 'carpool',
      rideId: 'ride-completed-1',
      passengerStatus: 'confirmed',
      state: 'closed',
      closedReason: 'completed'
    },
    participants: [
      { id: 'd1', name: 'Andriy P.', role: 'driver', status: 'confirmed', rating: 4.8 }
    ],
    metadata: {
      rideId: 'ride-completed-1',
      route: 'Lviv → Krakivets',
      date: '2025-01-20',
      status: 'completed',
      currentUserId: 'current-passenger'
    }
  },
  {
    id: 'sto-declined-1',
    service: 'sto',
    title: 'Brake Repair Request',
    subtitle: 'Provider selected • AutoService Plus',
    lastMessage: {
      id: '9',
      chatId: 'sto-declined-1',
      senderId: 'system',
      senderName: 'System',
      type: 'system',
      content: 'Another provider was selected for this request.',
      audience: 'system',
      timestamp: '2025-01-20T16:45:00Z',
      isRead: true
    },
    unreadCount: 0,
    userRole: 'service_provider',
    state: 'closed',
    closedReason: 'provider_selected',
    closedAt: '2025-01-20T16:45:00Z',
    lastEventAt: '2025-01-20T16:45:00Z',
    context: {
      domain: 'service',
      requestId: 'sto-request-declined-1',
      rfqStatus: 'provider_selected',
      providerHasResponded: true,
      currentUserId: 'current-provider',
      state: 'closed',
      closedReason: 'provider_selected'
    },
    participants: [],
    metadata: {
      requestId: 'sto-request-declined-1',
      status: 'declined',
      rfqStatus: 'provider_selected',
      currentUserId: 'current-provider'
    }
  },
  // ARCHIVED CHATS
  {
    id: 'carpool-archived-1',
    service: 'carpool',
    title: 'Kyiv → Odesa',
    subtitle: 'Last month • Cancelled',
    lastMessage: {
      id: '10',
      chatId: 'carpool-archived-1',
      senderId: 'system',
      senderName: 'System',
      type: 'system',
      content: 'Driver cancelled the ride.',
      audience: 'system',
      timestamp: '2024-12-20T15:00:00Z',
      isRead: true
    },
    unreadCount: 0,
    userRole: 'passenger',
    state: 'archived',
    closedReason: 'cancelled',
    closedAt: '2024-12-20T15:00:00Z',
    archivedAt: '2024-12-22T15:00:00Z',
    lastEventAt: '2024-12-20T15:00:00Z',
    context: {
      domain: 'carpool',
      rideId: 'ride-archived-1',
      passengerStatus: 'confirmed',
      state: 'archived',
      closedReason: 'cancelled'
    },
    participants: [
      { id: 'd1', name: 'Maria L.', role: 'driver', status: 'confirmed', rating: 4.7 }
    ],
    metadata: {
      rideId: 'ride-archived-1',
      route: 'Kyiv → Odesa',
      date: '2024-12-20',
      status: 'cancelled',
      currentUserId: 'current-passenger'
    }
  }
];

const serviceConfig = {
  carpool: { name: 'Carpool', icon: Car, color: 'text-blue-600' },
  bus: { name: 'Bus', icon: Bus, color: 'text-green-600' },
  train: { name: 'Train', icon: Train, color: 'text-purple-600' },
  sto: { name: 'STO', icon: Wrench, color: 'text-orange-600' },
  insurance: { name: 'Insurance', icon: Shield, color: 'text-red-600' },
  parking: { name: 'Parking', icon: Car, color: 'text-gray-600' },
  fuel: { name: 'Fuel', icon: Car, color: 'text-yellow-600' }
};

type ChatTab = 'active' | 'closed' | 'archived';

const PMobCarpoolChats: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ChatTab>('active');
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>('all');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messageText, setMessageText] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<ServiceType, boolean>>({
    carpool: true,
    bus: true,
    train: true,
    sto: true,
    insurance: true,
    parking: true,
    fuel: true
  });

  // Update current time every second for countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Group threads by service
  const serviceGroups = useMemo(() => {
    const groups = Object.keys(serviceConfig).map(service => {
      const serviceThreads = mockThreads.filter(t => t.service === service);
      const unreadCount = serviceThreads.reduce((sum, t) => sum + t.unreadCount, 0);
      
      return {
        service: service as ServiceType,
        name: serviceConfig[service as ServiceType].name,
        icon: serviceConfig[service as ServiceType].icon,
        color: serviceConfig[service as ServiceType].color,
        threads: serviceThreads,
        unreadCount
      };
    }).filter(group => group.threads.length > 0);

    return groups;
  }, []);

  // Filter threads based on tab, search and service
  const filteredThreadsByTab = useMemo(() => {
    let threadsForTab = mockThreads;
    
    // Filter by tab
    if (activeTab === 'active') {
      threadsForTab = mockThreads.filter(thread => thread.state === 'active' || thread.state === 'locked');
    } else if (activeTab === 'closed') {
      // Recently closed (last 48 hours)
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      threadsForTab = mockThreads.filter(thread => 
        thread.state === 'closed' && 
        thread.closedAt && 
        new Date(thread.closedAt) > twoDaysAgo
      );
    } else if (activeTab === 'archived') {
      threadsForTab = mockThreads.filter(thread => thread.state === 'archived');
    }
    
    return threadsForTab;
  }, [activeTab]);

  // Group filtered threads by service
  const serviceGroupsForTab = useMemo(() => {
    const groups = Object.keys(serviceConfig).map(service => {
      const serviceThreads = filteredThreadsByTab.filter(t => t.service === service);
      const unreadCount = serviceThreads.reduce((sum, t) => sum + t.unreadCount, 0);
      
      return {
        service: service as ServiceType,
        name: serviceConfig[service as ServiceType].name,
        icon: serviceConfig[service as ServiceType].icon,
        color: serviceConfig[service as ServiceType].color,
        threads: serviceThreads,
        unreadCount
      };
    }).filter(group => group.threads.length > 0);

    return groups;
  }, [filteredThreadsByTab]);

  // Filter threads based on search and service
  const filteredGroups = useMemo(() => {
    return serviceGroupsForTab.filter(group => {
      if (selectedService !== 'all' && group.service !== selectedService) return false;
      
      if (searchQuery) {
        return group.threads.some(thread => 
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return true;
    }).map(group => ({
      ...group,
      threads: group.threads.filter(thread => {
        if (!searchQuery) return true;
        return thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               thread.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
               thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      })
    }));
  }, [serviceGroupsForTab, selectedService, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const activeThreads = mockThreads.filter(t => t.state === 'active' || t.state === 'locked');
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const closedThreads = mockThreads.filter(t => 
      t.state === 'closed' && 
      t.closedAt && 
      new Date(t.closedAt) > twoDaysAgo
    );
    const archivedThreads = mockThreads.filter(t => t.state === 'archived');
    
    return {
      active: {
        count: activeThreads.length,
        unread: activeThreads.reduce((sum, t) => sum + t.unreadCount, 0)
      },
      closed: {
        count: closedThreads.length,
        unread: 0 // Closed chats don't have unread counts
      },
      archived: {
        count: archivedThreads.length,
        unread: 0 // Archived chats don't have unread counts
      }
    };
  }, []);

  const totalUnreadCount = tabCounts.active.unread;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h`;
    return date.toLocaleDateString();
  };

  const getAudienceBadge = (audience: AudienceType) => {
    switch (audience) {
      case 'all': return <Badge variant="secondary" className="text-xs">All</Badge>;
      case 'applicants': return <Badge variant="outline" className="text-xs">Applicants</Badge>;
      case 'confirmed': return <Badge variant="outline" className="text-xs">Confirmed</Badge>;
      case 'personal': return <Badge variant="outline" className="text-xs">Personal</Badge>;
      case 'system': return <Badge variant="secondary" className="text-xs">System</Badge>;
      case 'broadcast': return <Badge variant="secondary" className="text-xs">Broadcast</Badge>;
      case 'direct': return <Badge variant="outline" className="text-xs">Direct</Badge>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collecting': return <Badge variant="outline" className="text-xs text-blue-600">Collecting offers</Badge>;
      case 'under_review': return <Badge variant="outline" className="text-xs text-orange-600">Under review</Badge>;
      case 'provider_selected': return <Badge variant="outline" className="text-xs text-green-600">Provider selected</Badge>;
      case 'closed': return <Badge variant="secondary" className="text-xs">Closed</Badge>;
      case 'pending': return <Badge variant="outline" className="text-xs text-yellow-600">Pending confirmation</Badge>;
      case 'confirmed': return <Badge variant="outline" className="text-xs text-green-600">Confirmed</Badge>;
      case 'declined': return <Badge variant="outline" className="text-xs text-red-600">Declined</Badge>;
      default: return null;
    }
  };

  const getClosedReasonBadge = (reason?: ClosedReason, state?: ChatState) => {
    if (state === 'closed' || state === 'archived') {
      switch (reason) {
        case 'completed': return <Badge variant="secondary" className="text-xs text-green-600">✓ Completed</Badge>;
        case 'cancelled': return <Badge variant="secondary" className="text-xs text-red-600">✗ Cancelled</Badge>;
        case 'declined': return <Badge variant="secondary" className="text-xs text-red-600">Declined</Badge>;
        case 'provider_selected': return <Badge variant="secondary" className="text-xs text-gray-600">Provider selected</Badge>;
        case 'timeout': return <Badge variant="secondary" className="text-xs text-orange-600">Timeout</Badge>;
        case 'no_show': return <Badge variant="secondary" className="text-xs text-red-600">No show</Badge>;
        default: return <Badge variant="secondary" className="text-xs">READ-ONLY</Badge>;
      }
    }
    return null;
  };

  const getCTAs = (thread: ChatThread) => {
    if (thread.state !== 'closed') return [];
    
    const ctas = [];
    
    if (thread.context.domain === 'carpool') {
      if (thread.closedReason === 'completed') {
        ctas.push(
          { label: 'Rate', action: () => navigate(`/carpool/rate/${thread.id}`) },
          { label: 'Receipt', action: () => navigate(`/carpool/receipt/${thread.id}`) },
          { label: 'Rebook', action: () => navigate(`/carpool/search?from=${thread.metadata.route}`) }
        );
      } else if (thread.closedReason === 'cancelled') {
        ctas.push(
          { label: 'Rebook', action: () => navigate(`/carpool/search?from=${thread.metadata.route}`) }
        );
      }
    } else if (thread.context.domain === 'service') {
      if (thread.closedReason === 'provider_selected' && thread.userRole === 'service_client') {
        ctas.push(
          { label: 'Rate provider', action: () => navigate(`/${thread.service}/rate/${thread.id}`) },
          { label: 'Repeat request', action: () => navigate(`/${thread.service}/request`) }
        );
      }
    }
    
    return ctas;
  };

  const handleArchiveThread = (threadId: string) => {
    // Implementation would update the thread state
    console.log('Archiving thread:', threadId);
  };

  const handleUnarchiveThread = (threadId: string) => {
    // Implementation would update the thread state
    console.log('Unarchiving thread:', threadId);
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.type === 'system') return <Settings className="w-4 h-4 text-muted-foreground" />;
    if (message.type === 'askall') return <Volume2 className="w-4 h-4 text-primary" />;
    if (message.type === 'offer') return <DollarSign className="w-4 h-4 text-green-600" />;
    if (message.type === 'selection') return <CheckCircle className="w-4 h-4 text-primary" />;
    return null;
  };

  const handleSelectProvider = (thread: ChatThread, providerId: string) => {
    // Implementation would update the thread status and notify providers
    console.log('Selecting provider:', providerId, 'for thread:', thread.id);
    // This would trigger API calls to update the RFQ status
  };

  const handleSubmitNewRequest = (thread: ChatThread) => {
    // Navigate back to service request form
    navigate(`/${thread.service}/request`);
  };

  const canSendMessage = (thread: ChatThread) => {
    const permission = chatEligibilityService.canSendMessage(
      thread.userRole as Role,
      thread.context,
      currentTime
    );
    return permission;
  };

  const getComposerState = (thread: ChatThread) => {
    return chatEligibilityService.getComposerState(
      thread.userRole as Role,
      thread.context,
      currentTime
    );
  };

  const getPrimaryAction = (thread: ChatThread) => {
    return chatEligibilityService.getPrimaryAction(
      thread.userRole as Role,
      thread.context
    );
  };

  const toggleGroupExpanded = (service: ServiceType) => {
    setExpandedGroups(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const renderThreadItem = (thread: ChatThread) => {
    const canOpen = chatEligibilityService.canOpenChat(thread.userRole as Role, thread.context);
    const ctas = getCTAs(thread);
    
    return (
      <Card 
        key={thread.id}
        className={`cursor-pointer transition-colors ${
          selectedThread === thread.id ? 'bg-primary/5 border-primary' : 'hover:bg-accent/50'
        } ${!canOpen.allowed ? 'opacity-60' : ''} ${
          thread.state === 'closed' ? 'bg-gray-50' : thread.state === 'archived' ? 'opacity-75' : ''
        }`}
        onClick={() => canOpen.allowed && setSelectedThread(thread.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={thread.lastMessage.senderAvatar} />
              <AvatarFallback>
                {thread.service === 'sto' ? <Wrench className="w-4 h-4" /> :
                 thread.service === 'insurance' ? <Shield className="w-4 h-4" /> :
                 thread.lastMessage.senderName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{thread.title}</h3>
                  {getClosedReasonBadge(thread.closedReason, thread.state)}
                  {thread.state === 'active' && thread.context.domain === 'service' && getStatusBadge(thread.metadata.rfqStatus || '')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(thread.lastMessage.timestamp)}
                  </span>
                  {thread.unreadCount > 0 && (
                    <Badge variant="default" className="text-xs min-w-[20px] h-5">
                      {thread.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {thread.subtitle}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                {getMessageIcon(thread.lastMessage)}
                <span className="text-sm text-muted-foreground truncate flex-1">
                  {thread.lastMessage.type === 'system' ? (
                    <span className="flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      {thread.lastMessage.content}
                    </span>
                  ) : thread.lastMessage.type === 'offer' ? (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Offer: {thread.lastMessage.content}
                    </span>
                  ) : (
                    `${thread.lastMessage.senderName}: ${thread.lastMessage.content}`
                  )}
                </span>
                {getAudienceBadge(thread.lastMessage.audience)}
              </div>

              {/* CTAs for closed chats */}
              {ctas.length > 0 && (
                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  {ctas.map((cta, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={cta.action}
                      className="text-xs h-7"
                    >
                      {cta.label}
                    </Button>
                  ))}
                  {thread.state === 'closed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveThread(thread.id)}
                      className="text-xs h-7"
                    >
                      Archive
                    </Button>
                  )}
                </div>
              )}

              {/* Unarchive option for archived chats */}
              {thread.state === 'archived' && (
                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnarchiveThread(thread.id)}
                    className="text-xs h-7"
                  >
                    Unarchive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedThread(thread.id)}
                    className="text-xs h-7"
                  >
                    View details
                  </Button>
                </div>
              )}

              {/* Service-specific indicators for active chats */}
              {thread.state === 'active' && thread.context.domain === 'service' && thread.userRole === 'service_client' && (
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {thread.participants.length} provider{thread.participants.length !== 1 ? 's' : ''} responded
                  </span>
                  {thread.context.rfqStatus === 'collecting' && (
                    <span className="text-xs text-blue-600">• Collecting offers</span>
                  )}
                </div>
              )}

              {/* Countdown for carpool applicants */}
              {thread.state === 'active' && 
               thread.context.domain === 'carpool' && 
               thread.userRole === 'passenger' && 
               thread.context.passengerStatus === 'applicant' && (
                <div className="flex items-center gap-2 mt-2">
                  <Timer className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-yellow-600">
                    Message available soon
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderServiceGroup = (group: ServiceGroup) => {
    const ServiceIcon = group.icon;
    const isExpanded = expandedGroups[group.service];
    
    return (
      <div key={group.service} className="mb-4">
        <Collapsible open={isExpanded} onOpenChange={() => toggleGroupExpanded(group.service)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <ServiceIcon className={`w-5 h-5 ${group.color}`} />
                <span className="font-medium">{group.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {group.threads.length}
                </Badge>
                {group.unreadCount > 0 && (
                  <Badge variant="default" className="text-xs">
                    {group.unreadCount}
                  </Badge>
                )}
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 mt-2">
            {group.threads.map(renderThreadItem)}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderChatView = () => {
    const thread = mockThreads.find(t => t.id === selectedThread);
    if (!thread) return null;

    const threadMessages = mockMessages.filter(m => m.chatId === thread.id);
    const composerState = getComposerState(thread);
    const primaryAction = getPrimaryAction(thread);
    const sendPermission = canSendMessage(thread);

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedThread(null)}
                className="md:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {thread.userRole === 'driver' ? 'D' : thread.participants[0]?.name.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{thread.title}</h2>
                    {getStatusBadge(thread.metadata.status || '')}
                  </div>
                  <p className="text-sm text-muted-foreground">{thread.subtitle}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {(thread.userRole === 'driver' || thread.userRole === 'service_client') && thread.participants.length > 0 && (
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  {thread.userRole === 'driver' ? 'Participants' : 'Providers'}
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters for different roles */}
          {thread.userRole === 'driver' && thread.context.domain === 'carpool' && (
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="ghost" size="sm">Applicants</Button>
              <Button variant="ghost" size="sm">Confirmed</Button>
              <Button variant="ghost" size="sm">DMs</Button>
              <Button variant="ghost" size="sm">System</Button>
            </div>
          )}

          {/* Service providers list for service_client */}
          {thread.userRole === 'service_client' && thread.context.domain === 'service' && (
            <div className="mt-3">
              <div className="grid gap-2">
                {thread.participants.map((participant) => (
                  <Card key={participant.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{participant.name}</span>
                            {participant.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{participant.rating}</span>
                              </div>
                            )}
                          </div>
                          {participant.offer && (
                            <div className="text-xs text-muted-foreground">
                              {participant.offer.price ? `₴${participant.offer.price}` : 'Free'} • {participant.offer.eta}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {participant.status === 'selected' ? (
                          <Badge variant="default" className="text-xs">Selected</Badge>
                        ) : participant.status === 'not_selected' ? (
                          <Badge variant="secondary" className="text-xs">Not selected</Badge>
                        ) : primaryAction.visible && primaryAction.kind === 'select_provider' && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectProvider(thread, participant.id)}
                            disabled={primaryAction.disabled}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {participant.offer?.description && (
                      <p className="text-sm text-muted-foreground mt-2">{participant.offer.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {threadMessages.map((message) => (
            <div key={message.id} className="space-y-2">
              {message.type === 'system' ? (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className={`flex gap-3 ${message.senderId === 'current-user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[70%] ${message.senderId === 'current-user' ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      {getAudienceBadge(message.audience)}
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className={`rounded-lg p-3 ${
                      message.senderId === 'current-user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Primary Action */}
        {primaryAction.visible && (
          <div className="border-t border-border p-4 bg-muted/30">
            {primaryAction.kind === 'select_provider' && (
              <Button 
                className="w-full" 
                disabled={primaryAction.disabled}
                onClick={() => {
                  // Show provider selection UI above
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {primaryAction.label}
              </Button>
            )}
            
            {primaryAction.kind === 'submit_new_request' && (
              <Button 
                className="w-full" 
                onClick={() => handleSubmitNewRequest(thread)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Message Composer */}
        <div className="border-t border-border p-4">
          <div className="space-y-3">
            {/* Countdown Timer for restricted messaging */}
            {composerState.showCountdown && composerState.countdownSec && composerState.countdownSec > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Timer className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  The driver has received your request. If there's no reply, you can message after the timer.
                </span>
              </div>
            )}

            {/* Audience selector for drivers and service clients */}
            {(thread.userRole === 'driver' || thread.userRole === 'service_client') && 
             thread.context.domain === 'carpool' && sendPermission.allowed && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Send to:</span>
                <Select value={selectedAudience} onValueChange={(value) => setSelectedAudience(value as AudienceType)}>
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All participants</SelectItem>
                    <SelectItem value="applicants">Applicants only</SelectItem>
                    <SelectItem value="confirmed">Confirmed only</SelectItem>
                    <SelectItem value="personal">Personal message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {thread.userRole === 'service_client' && 
             thread.context.domain === 'service' && 
             thread.context.rfqStatus === 'collecting' && sendPermission.allowed && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Send to:</span>
                <Select value={selectedAudience} onValueChange={(value) => setSelectedAudience(value as AudienceType)}>
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broadcast">All providers</SelectItem>
                    <SelectItem value="direct">Specific provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={composerState.placeholder}
                  disabled={composerState.disabled}
                  className="min-h-[40px] resize-none pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1"
                  disabled={composerState.disabled}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                disabled={composerState.disabled || !messageText.trim()}
                onClick={() => {
                  // Send message logic
                  console.log('Sending message:', messageText, 'to:', selectedAudience);
                  setMessageText('');
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Rate limiting notice */}
            {!sendPermission.allowed && sendPermission.reason === 'rfq_closed' && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-800">
                  Request closed. You were not selected.
                </span>
              </div>
            )}

            {/* Pro features for drivers */}
            {thread.userRole === 'driver' && thread.context.domain === 'carpool' && sendPermission.allowed && (
              <Button variant="outline" size="sm" className="w-full">
                <Volume2 className="w-4 h-4 mr-2" />
                Ask All (Pro Feature)
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-semibold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                All conversations
                {totalUnreadCount > 0 && (
                  <Badge variant="default" className="ml-2 text-xs">
                    {totalUnreadCount} unread
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChatTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active
              {tabCounts.active.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.active.count}
                </Badge>
              )}
              {tabCounts.active.unread > 0 && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center gap-2">
              Closed
              {tabCounts.closed.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.closed.count}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              Archived
              {tabCounts.archived.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.archived.count}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedService === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedService('all')}
            >
              All Services
            </Button>
            {Object.entries(serviceConfig).map(([service, config]) => {
              const ServiceIcon = config.icon;
              const serviceGroup = serviceGroups.find(g => g.service === service);
              if (!serviceGroup) return null;
              
              return (
                <Button
                  key={service}
                  variant={selectedService === service ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedService(service as ServiceType)}
                  className="flex-shrink-0"
                >
                  <ServiceIcon className={`w-4 h-4 mr-1 ${config.color}`} />
                  {config.name}
                  {serviceGroup.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {serviceGroup.unreadCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat List */}
        <div className={`w-full md:w-96 border-r border-border overflow-y-auto p-4 ${
          selectedThread ? 'hidden md:block' : ''
        }`}>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">
                {activeTab === 'active' && 'No active chats'}
                {activeTab === 'closed' && 'No recently closed chats'}
                {activeTab === 'archived' && 'Archive is empty'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'active' && !searchQuery && (
                  <>
                    <span>• Create a ride / Find a ride</span>
                    <br />
                    <span>• Create service request</span>
                  </>
                )}
                {activeTab === 'closed' && 'History moves to "Archived" after 48 hours'}
                {activeTab === 'archived' && 'Tip: Swipe a chat card in Active/Closed to archive it'}
                {searchQuery && 'Try adjusting your search'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map(renderServiceGroup)}
            </div>
          )}
        </div>

        {/* Main Chat View */}
        <div className={`flex-1 ${selectedThread ? '' : 'hidden md:flex'} flex-col`}>
          {selectedThread ? (
            renderChatView()
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PMobCarpoolChats;