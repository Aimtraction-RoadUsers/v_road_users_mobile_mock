// Priority calculation helpers
export const getDomainPriority = (domain) => {
    switch (domain) {
        case "docs": return 10; // Legal/financial most urgent
        case "mobility": return 8; // Travel needs
        case "care": return 6; // Vehicle maintenance
        case "city": return 4; // Lifestyle/convenience
        default: return 1;
    }
};
export const getStatusPriority = (status) => {
    switch (status) {
        case "overdue": return 20;
        case "todo": return 10;
        case "soon": return 5;
        case "info": return 2;
        case "done": return 0;
        default: return 1;
    }
};
export const calculatePriority = (item) => {
    const statusPrio = getStatusPriority(item.status);
    const domainPrio = getDomainPriority(item.domain);
    // Time urgency
    let timeUrgency = 0;
    if (item.dueAt) {
        const now = new Date();
        const dueDate = new Date(item.dueAt);
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilDue < 0)
            timeUrgency = 50; // Overdue
        else if (hoursUntilDue < 24)
            timeUrgency = 30; // Due today
        else if (hoursUntilDue < 72)
            timeUrgency = 15; // Due soon
        else
            timeUrgency = 0;
    }
    return statusPrio + domainPrio + timeUrgency + (item.priority || 0);
};
// Selectors
export const selectNextUp = (items) => {
    return items
        .filter(item => ['todo', 'soon', 'overdue'].includes(item.status))
        .sort((a, b) => calculatePriority(b) - calculatePriority(a))
        .slice(0, 3);
};
export const selectByDomain = (items, domain) => {
    return items
        .filter(item => item.domain === domain)
        .sort((a, b) => calculatePriority(b) - calculatePriority(a));
};
export const selectResume = (items) => {
    return items
        .filter(item => item.kind.includes('draft') || item.status === 'info')
        .slice(0, 3);
};
