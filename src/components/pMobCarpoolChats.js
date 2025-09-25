import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { MessageCircle, Car, Bus, Train, Shield, Wrench, Search, Filter, ChevronRight, ChevronDown, Star, Users, CheckCircle, Settings, Send, Paperclip, MoreVertical, Volume2, X, Timer, FileText, DollarSign, AlertTriangle } from 'lucide-react';
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
import { chatEligibilityService } from '../services/ChatEligibilityService';
// Mock data
const mockMessages = [
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
const mockThreads = [
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
const PMobCarpoolChats = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [selectedService, setSelectedService] = useState('all');
    const [selectedThread, setSelectedThread] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [messageText, setMessageText] = useState('');
    const [selectedAudience, setSelectedAudience] = useState('all');
    const [expandedGroups, setExpandedGroups] = useState({
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
                service: service,
                name: serviceConfig[service].name,
                icon: serviceConfig[service].icon,
                color: serviceConfig[service].color,
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
        }
        else if (activeTab === 'closed') {
            // Recently closed (last 48 hours)
            const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
            threadsForTab = mockThreads.filter(thread => thread.state === 'closed' &&
                thread.closedAt &&
                new Date(thread.closedAt) > twoDaysAgo);
        }
        else if (activeTab === 'archived') {
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
                service: service,
                name: serviceConfig[service].name,
                icon: serviceConfig[service].icon,
                color: serviceConfig[service].color,
                threads: serviceThreads,
                unreadCount
            };
        }).filter(group => group.threads.length > 0);
        return groups;
    }, [filteredThreadsByTab]);
    // Filter threads based on search and service
    const filteredGroups = useMemo(() => {
        return serviceGroupsForTab.filter(group => {
            if (selectedService !== 'all' && group.service !== selectedService)
                return false;
            if (searchQuery) {
                return group.threads.some(thread => thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    thread.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            return true;
        }).map(group => ({
            ...group,
            threads: group.threads.filter(thread => {
                if (!searchQuery)
                    return true;
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
        const closedThreads = mockThreads.filter(t => t.state === 'closed' &&
            t.closedAt &&
            new Date(t.closedAt) > twoDaysAgo);
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
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        if (diffHours < 1)
            return 'Now';
        if (diffHours < 24)
            return `${Math.floor(diffHours)}h`;
        return date.toLocaleDateString();
    };
    const getAudienceBadge = (audience) => {
        switch (audience) {
            case 'all': return _jsx(Badge, { variant: "secondary", className: "text-xs", children: "All" });
            case 'applicants': return _jsx(Badge, { variant: "outline", className: "text-xs", children: "Applicants" });
            case 'confirmed': return _jsx(Badge, { variant: "outline", className: "text-xs", children: "Confirmed" });
            case 'personal': return _jsx(Badge, { variant: "outline", className: "text-xs", children: "Personal" });
            case 'system': return _jsx(Badge, { variant: "secondary", className: "text-xs", children: "System" });
            case 'broadcast': return _jsx(Badge, { variant: "secondary", className: "text-xs", children: "Broadcast" });
            case 'direct': return _jsx(Badge, { variant: "outline", className: "text-xs", children: "Direct" });
            default: return null;
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'collecting': return _jsx(Badge, { variant: "outline", className: "text-xs text-blue-600", children: "Collecting offers" });
            case 'under_review': return _jsx(Badge, { variant: "outline", className: "text-xs text-orange-600", children: "Under review" });
            case 'provider_selected': return _jsx(Badge, { variant: "outline", className: "text-xs text-green-600", children: "Provider selected" });
            case 'closed': return _jsx(Badge, { variant: "secondary", className: "text-xs", children: "Closed" });
            case 'pending': return _jsx(Badge, { variant: "outline", className: "text-xs text-yellow-600", children: "Pending confirmation" });
            case 'confirmed': return _jsx(Badge, { variant: "outline", className: "text-xs text-green-600", children: "Confirmed" });
            case 'declined': return _jsx(Badge, { variant: "outline", className: "text-xs text-red-600", children: "Declined" });
            default: return null;
        }
    };
    const getClosedReasonBadge = (reason, state) => {
        if (state === 'closed' || state === 'archived') {
            switch (reason) {
                case 'completed': return _jsx(Badge, { variant: "secondary", className: "text-xs text-green-600", children: "\u2713 Completed" });
                case 'cancelled': return _jsx(Badge, { variant: "secondary", className: "text-xs text-red-600", children: "\u2717 Cancelled" });
                case 'declined': return _jsx(Badge, { variant: "secondary", className: "text-xs text-red-600", children: "Declined" });
                case 'provider_selected': return _jsx(Badge, { variant: "secondary", className: "text-xs text-gray-600", children: "Provider selected" });
                case 'timeout': return _jsx(Badge, { variant: "secondary", className: "text-xs text-orange-600", children: "Timeout" });
                case 'no_show': return _jsx(Badge, { variant: "secondary", className: "text-xs text-red-600", children: "No show" });
                default: return _jsx(Badge, { variant: "secondary", className: "text-xs", children: "READ-ONLY" });
            }
        }
        return null;
    };
    const getCTAs = (thread) => {
        if (thread.state !== 'closed')
            return [];
        const ctas = [];
        if (thread.context.domain === 'carpool') {
            if (thread.closedReason === 'completed') {
                ctas.push({ label: 'Rate', action: () => navigate(`/carpool/rate/${thread.id}`) }, { label: 'Receipt', action: () => navigate(`/carpool/receipt/${thread.id}`) }, { label: 'Rebook', action: () => navigate(`/carpool/search?from=${thread.metadata.route}`) });
            }
            else if (thread.closedReason === 'cancelled') {
                ctas.push({ label: 'Rebook', action: () => navigate(`/carpool/search?from=${thread.metadata.route}`) });
            }
        }
        else if (thread.context.domain === 'service') {
            if (thread.closedReason === 'provider_selected' && thread.userRole === 'service_client') {
                ctas.push({ label: 'Rate provider', action: () => navigate(`/${thread.service}/rate/${thread.id}`) }, { label: 'Repeat request', action: () => navigate(`/${thread.service}/request`) });
            }
        }
        return ctas;
    };
    const handleArchiveThread = (threadId) => {
        // Implementation would update the thread state
        console.log('Archiving thread:', threadId);
    };
    const handleUnarchiveThread = (threadId) => {
        // Implementation would update the thread state
        console.log('Unarchiving thread:', threadId);
    };
    const getMessageIcon = (message) => {
        if (message.type === 'system')
            return _jsx(Settings, { className: "w-4 h-4 text-muted-foreground" });
        if (message.type === 'askall')
            return _jsx(Volume2, { className: "w-4 h-4 text-primary" });
        if (message.type === 'offer')
            return _jsx(DollarSign, { className: "w-4 h-4 text-green-600" });
        if (message.type === 'selection')
            return _jsx(CheckCircle, { className: "w-4 h-4 text-primary" });
        return null;
    };
    const handleSelectProvider = (thread, providerId) => {
        // Implementation would update the thread status and notify providers
        console.log('Selecting provider:', providerId, 'for thread:', thread.id);
        // This would trigger API calls to update the RFQ status
    };
    const handleSubmitNewRequest = (thread) => {
        // Navigate back to service request form
        navigate(`/${thread.service}/request`);
    };
    const canSendMessage = (thread) => {
        const permission = chatEligibilityService.canSendMessage(thread.userRole, thread.context, currentTime);
        return permission;
    };
    const getComposerState = (thread) => {
        return chatEligibilityService.getComposerState(thread.userRole, thread.context, currentTime);
    };
    const getPrimaryAction = (thread) => {
        return chatEligibilityService.getPrimaryAction(thread.userRole, thread.context);
    };
    const toggleGroupExpanded = (service) => {
        setExpandedGroups(prev => ({
            ...prev,
            [service]: !prev[service]
        }));
    };
    const renderThreadItem = (thread) => {
        const canOpen = chatEligibilityService.canOpenChat(thread.userRole, thread.context);
        const ctas = getCTAs(thread);
        return (_jsx(Card, { className: `cursor-pointer transition-colors ${selectedThread === thread.id ? 'bg-primary/5 border-primary' : 'hover:bg-accent/50'} ${!canOpen.allowed ? 'opacity-60' : ''} ${thread.state === 'closed' ? 'bg-gray-50' : thread.state === 'archived' ? 'opacity-75' : ''}`, onClick: () => canOpen.allowed && setSelectedThread(thread.id), children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsxs(Avatar, { className: "w-10 h-10", children: [_jsx(AvatarImage, { src: thread.lastMessage.senderAvatar }), _jsx(AvatarFallback, { children: thread.service === 'sto' ? _jsx(Wrench, { className: "w-4 h-4" }) :
                                        thread.service === 'insurance' ? _jsx(Shield, { className: "w-4 h-4" }) :
                                            thread.lastMessage.senderName.charAt(0) })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-medium truncate", children: thread.title }), getClosedReasonBadge(thread.closedReason, thread.state), thread.state === 'active' && thread.context.domain === 'service' && getStatusBadge(thread.metadata.rfqStatus || '')] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(thread.lastMessage.timestamp) }), thread.unreadCount > 0 && (_jsx(Badge, { variant: "default", className: "text-xs min-w-[20px] h-5", children: thread.unreadCount }))] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2 truncate", children: thread.subtitle }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [getMessageIcon(thread.lastMessage), _jsx("span", { className: "text-sm text-muted-foreground truncate flex-1", children: thread.lastMessage.type === 'system' ? (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Settings, { className: "w-3 h-3" }), thread.lastMessage.content] })) : thread.lastMessage.type === 'offer' ? (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(DollarSign, { className: "w-3 h-3" }), "Offer: ", thread.lastMessage.content] })) : (`${thread.lastMessage.senderName}: ${thread.lastMessage.content}`) }), getAudienceBadge(thread.lastMessage.audience)] }), ctas.length > 0 && (_jsxs("div", { className: "flex gap-2 mt-2", onClick: (e) => e.stopPropagation(), children: [ctas.map((cta, index) => (_jsx(Button, { variant: "outline", size: "sm", onClick: cta.action, className: "text-xs h-7", children: cta.label }, index))), thread.state === 'closed' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleArchiveThread(thread.id), className: "text-xs h-7", children: "Archive" }))] })), thread.state === 'archived' && (_jsxs("div", { className: "flex gap-2 mt-2", onClick: (e) => e.stopPropagation(), children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleUnarchiveThread(thread.id), className: "text-xs h-7", children: "Unarchive" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedThread(thread.id), className: "text-xs h-7", children: "View details" })] })), thread.state === 'active' && thread.context.domain === 'service' && thread.userRole === 'service_client' && (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Users, { className: "w-3 h-3 text-muted-foreground" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [thread.participants.length, " provider", thread.participants.length !== 1 ? 's' : '', " responded"] }), thread.context.rfqStatus === 'collecting' && (_jsx("span", { className: "text-xs text-blue-600", children: "\u2022 Collecting offers" }))] })), thread.state === 'active' &&
                                    thread.context.domain === 'carpool' &&
                                    thread.userRole === 'passenger' &&
                                    thread.context.passengerStatus === 'applicant' && (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Timer, { className: "w-3 h-3 text-yellow-600" }), _jsx("span", { className: "text-xs text-yellow-600", children: "Message available soon" })] }))] })] }) }) }, thread.id));
    };
    const renderServiceGroup = (group) => {
        const ServiceIcon = group.icon;
        const isExpanded = expandedGroups[group.service];
        return (_jsx("div", { className: "mb-4", children: _jsxs(Collapsible, { open: isExpanded, onOpenChange: () => toggleGroupExpanded(group.service), children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", className: "w-full justify-between p-2 h-auto", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ServiceIcon, { className: `w-5 h-5 ${group.color}` }), _jsx("span", { className: "font-medium", children: group.name }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: group.threads.length }), group.unreadCount > 0 && (_jsx(Badge, { variant: "default", className: "text-xs", children: group.unreadCount }))] }), isExpanded ? _jsx(ChevronDown, { className: "w-4 h-4" }) : _jsx(ChevronRight, { className: "w-4 h-4" })] }) }), _jsx(CollapsibleContent, { className: "space-y-2 mt-2", children: group.threads.map(renderThreadItem) })] }) }, group.service));
    };
    const renderChatView = () => {
        const thread = mockThreads.find(t => t.id === selectedThread);
        if (!thread)
            return null;
        const threadMessages = mockMessages.filter(m => m.chatId === thread.id);
        const composerState = getComposerState(thread);
        const primaryAction = getPrimaryAction(thread);
        const sendPermission = canSendMessage(thread);
        return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "border-b border-border p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedThread(null), className: "md:hidden", children: _jsx(X, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Avatar, { className: "w-8 h-8", children: [_jsx(AvatarImage, { src: "" }), _jsx(AvatarFallback, { children: thread.userRole === 'driver' ? 'D' : thread.participants[0]?.name.charAt(0) || 'S' })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "font-medium", children: thread.title }), getStatusBadge(thread.metadata.status || '')] }), _jsx("p", { className: "text-sm text-muted-foreground", children: thread.subtitle })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [(thread.userRole === 'driver' || thread.userRole === 'service_client') && thread.participants.length > 0 && (_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Users, { className: "w-4 h-4 mr-1" }), thread.userRole === 'driver' ? 'Participants' : 'Providers'] })), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "w-4 h-4" }) })] })] }), thread.userRole === 'driver' && thread.context.domain === 'carpool' && (_jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx(Button, { variant: "outline", size: "sm", children: "All" }), _jsx(Button, { variant: "ghost", size: "sm", children: "Applicants" }), _jsx(Button, { variant: "ghost", size: "sm", children: "Confirmed" }), _jsx(Button, { variant: "ghost", size: "sm", children: "DMs" }), _jsx(Button, { variant: "ghost", size: "sm", children: "System" })] })), thread.userRole === 'service_client' && thread.context.domain === 'service' && (_jsx("div", { className: "mt-3", children: _jsx("div", { className: "grid gap-2", children: thread.participants.map((participant) => (_jsxs(Card, { className: "p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { className: "w-8 h-8", children: _jsx(AvatarFallback, { children: participant.name.charAt(0) }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm", children: participant.name }), participant.rating && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "text-xs", children: participant.rating })] }))] }), participant.offer && (_jsxs("div", { className: "text-xs text-muted-foreground", children: [participant.offer.price ? `₴${participant.offer.price}` : 'Free', " \u2022 ", participant.offer.eta] }))] })] }), _jsx("div", { className: "flex items-center gap-2", children: participant.status === 'selected' ? (_jsx(Badge, { variant: "default", className: "text-xs", children: "Selected" })) : participant.status === 'not_selected' ? (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Not selected" })) : primaryAction.visible && primaryAction.kind === 'select_provider' && (_jsx(Button, { size: "sm", onClick: () => handleSelectProvider(thread, participant.id), disabled: primaryAction.disabled, children: "Select" })) })] }), participant.offer?.description && (_jsx("p", { className: "text-sm text-muted-foreground mt-2", children: participant.offer.description }))] }, participant.id))) }) }))] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: threadMessages.map((message) => (_jsx("div", { className: "space-y-2", children: message.type === 'system' ? (_jsx("div", { className: "bg-muted/50 rounded-lg p-3 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [_jsx(Settings, { className: "w-4 h-4" }), message.content] }) })) : (_jsxs("div", { className: `flex gap-3 ${message.senderId === 'current-user' ? 'flex-row-reverse' : ''}`, children: [_jsxs(Avatar, { className: "w-8 h-8", children: [_jsx(AvatarImage, { src: message.senderAvatar }), _jsx(AvatarFallback, { children: message.senderName.charAt(0) })] }), _jsxs("div", { className: `max-w-[70%] ${message.senderId === 'current-user' ? 'text-right' : ''}`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-medium", children: message.senderName }), getAudienceBadge(message.audience), _jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(message.timestamp) })] }), _jsx("div", { className: `rounded-lg p-3 ${message.senderId === 'current-user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'}`, children: message.content })] })] })) }, message.id))) }), primaryAction.visible && (_jsxs("div", { className: "border-t border-border p-4 bg-muted/30", children: [primaryAction.kind === 'select_provider' && (_jsxs(Button, { className: "w-full", disabled: primaryAction.disabled, onClick: () => {
                                // Show provider selection UI above
                            }, children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-2" }), primaryAction.label] })), primaryAction.kind === 'submit_new_request' && (_jsxs(Button, { className: "w-full", onClick: () => handleSubmitNewRequest(thread), children: [_jsx(FileText, { className: "w-4 h-4 mr-2" }), primaryAction.label] }))] })), _jsx("div", { className: "border-t border-border p-4", children: _jsxs("div", { className: "space-y-3", children: [composerState.showCountdown && composerState.countdownSec && composerState.countdownSec > 0 && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg", children: [_jsx(Timer, { className: "w-4 h-4 text-yellow-600" }), _jsx("span", { className: "text-sm text-yellow-800", children: "The driver has received your request. If there's no reply, you can message after the timer." })] })), (thread.userRole === 'driver' || thread.userRole === 'service_client') &&
                                thread.context.domain === 'carpool' && sendPermission.allowed && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Send to:" }), _jsxs(Select, { value: selectedAudience, onValueChange: (value) => setSelectedAudience(value), children: [_jsx(SelectTrigger, { className: "w-auto", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All participants" }), _jsx(SelectItem, { value: "applicants", children: "Applicants only" }), _jsx(SelectItem, { value: "confirmed", children: "Confirmed only" }), _jsx(SelectItem, { value: "personal", children: "Personal message" })] })] })] })), thread.userRole === 'service_client' &&
                                thread.context.domain === 'service' &&
                                thread.context.rfqStatus === 'collecting' && sendPermission.allowed && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Send to:" }), _jsxs(Select, { value: selectedAudience, onValueChange: (value) => setSelectedAudience(value), children: [_jsx(SelectTrigger, { className: "w-auto", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "broadcast", children: "All providers" }), _jsx(SelectItem, { value: "direct", children: "Specific provider" })] })] })] })), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Textarea, { value: messageText, onChange: (e) => setMessageText(e.target.value), placeholder: composerState.placeholder, disabled: composerState.disabled, className: "min-h-[40px] resize-none pr-10" }), _jsx(Button, { size: "sm", variant: "ghost", className: "absolute right-1 top-1", disabled: composerState.disabled, children: _jsx(Paperclip, { className: "w-4 h-4" }) })] }), _jsx(Button, { size: "sm", disabled: composerState.disabled || !messageText.trim(), onClick: () => {
                                            // Send message logic
                                            console.log('Sending message:', messageText, 'to:', selectedAudience);
                                            setMessageText('');
                                        }, children: _jsx(Send, { className: "w-4 h-4" }) })] }), !sendPermission.allowed && sendPermission.reason === 'rfq_closed' && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-gray-600" }), _jsx("span", { className: "text-sm text-gray-800", children: "Request closed. You were not selected." })] })), thread.userRole === 'driver' && thread.context.domain === 'carpool' && sendPermission.allowed && (_jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [_jsx(Volume2, { className: "w-4 h-4 mr-2" }), "Ask All (Pro Feature)"] }))] }) })] }));
    };
    return (_jsxs("div", { className: "h-screen bg-background flex flex-col", children: [_jsxs("div", { className: "border-b border-border p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MessageCircle, { className: "w-6 h-6 text-primary" }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold", children: "Messages" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["All conversations", totalUnreadCount > 0 && (_jsxs(Badge, { variant: "default", className: "ml-2 text-xs", children: [totalUnreadCount, " unread"] }))] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Filter, { className: "w-4 h-4" }) })] }), _jsx(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), className: "w-full", children: _jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "active", className: "flex items-center gap-2", children: ["Active", tabCounts.active.count > 0 && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: tabCounts.active.count })), tabCounts.active.unread > 0 && (_jsx("div", { className: "w-2 h-2 bg-primary rounded-full" }))] }), _jsxs(TabsTrigger, { value: "closed", className: "flex items-center gap-2", children: ["Closed", tabCounts.closed.count > 0 && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: tabCounts.closed.count }))] }), _jsxs(TabsTrigger, { value: "archived", className: "flex items-center gap-2", children: ["Archived", tabCounts.archived.count > 0 && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: tabCounts.archived.count }))] })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs("div", { className: "flex gap-2 overflow-x-auto pb-2", children: [_jsx(Button, { variant: selectedService === 'all' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedService('all'), children: "All Services" }), Object.entries(serviceConfig).map(([service, config]) => {
                                        const ServiceIcon = config.icon;
                                        const serviceGroup = serviceGroups.find(g => g.service === service);
                                        if (!serviceGroup)
                                            return null;
                                        return (_jsxs(Button, { variant: selectedService === service ? 'default' : 'outline', size: "sm", onClick: () => setSelectedService(service), className: "flex-shrink-0", children: [_jsx(ServiceIcon, { className: `w-4 h-4 mr-1 ${config.color}` }), config.name, serviceGroup.unreadCount > 0 && (_jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: serviceGroup.unreadCount }))] }, service));
                                    })] })] })] }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsx("div", { className: `w-full md:w-96 border-r border-border overflow-y-auto p-4 ${selectedThread ? 'hidden md:block' : ''}`, children: filteredGroups.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(MessageCircle, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }), _jsxs("h3", { className: "font-medium mb-2", children: [activeTab === 'active' && 'No active chats', activeTab === 'closed' && 'No recently closed chats', activeTab === 'archived' && 'Archive is empty'] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [activeTab === 'active' && !searchQuery && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022 Create a ride / Find a ride" }), _jsx("br", {}), _jsx("span", { children: "\u2022 Create service request" })] })), activeTab === 'closed' && 'History moves to "Archived" after 48 hours', activeTab === 'archived' && 'Tip: Swipe a chat card in Active/Closed to archive it', searchQuery && 'Try adjusting your search'] })] })) : (_jsx("div", { className: "space-y-4", children: filteredGroups.map(renderServiceGroup) })) }), _jsx("div", { className: `flex-1 ${selectedThread ? '' : 'hidden md:flex'} flex-col`, children: selectedThread ? (renderChatView()) : (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageCircle, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "font-medium mb-2", children: "Select a conversation" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Choose a conversation from the list to start messaging" })] }) })) })] })] }));
};
export default PMobCarpoolChats;
