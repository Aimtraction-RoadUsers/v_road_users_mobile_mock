// ─────────────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
    applicantMessageDelaySec: 300, // 5 minutes
    passengerRateLimitSec: 180, // 3 minutes
    clientBroadcastRateLimitSec: 120 // 2 minutes
};
// ─────────────────────────────────────────────────────────────
// Implementation
// ─────────────────────────────────────────────────────────────
export class ChatEligibilityServiceImpl {
    constructor(config = DEFAULT_CONFIG) {
        this.config = config;
    }
    canOpenChat(role, ctx) {
        if (ctx.domain === "carpool") {
            return this.canOpenCarpoolChat(role, ctx);
        }
        else if (ctx.domain === "service") {
            return this.canOpenServiceChat(role, ctx);
        }
        return { allowed: false, reason: "unknown_domain" };
    }
    canSendMessage(role, ctx, now = new Date()) {
        // Check chat state first
        if (ctx.state === "closed" || ctx.state === "archived") {
            return { allowed: false, reason: "chat_closed" };
        }
        if (ctx.domain === "carpool") {
            return this.canSendCarpoolMessage(role, ctx, now);
        }
        else if (ctx.domain === "service") {
            return this.canSendServiceMessage(role, ctx, now);
        }
        return { allowed: false, reason: "unknown_domain" };
    }
    getComposerState(role, ctx, now = new Date()) {
        const sendPermission = this.canSendMessage(role, ctx, now);
        if (ctx.domain === "carpool") {
            return this.getCarpoolComposerState(role, ctx, sendPermission);
        }
        else if (ctx.domain === "service") {
            return this.getServiceComposerState(role, ctx, sendPermission);
        }
        return {
            disabled: true,
            placeholder: "Chat not available"
        };
    }
    getPrimaryAction(role, ctx) {
        if (ctx.domain === "carpool") {
            return this.getCarpoolPrimaryAction(role, ctx);
        }
        else if (ctx.domain === "service") {
            return this.getServicePrimaryAction(role, ctx);
        }
        return {
            kind: "none",
            label: "",
            visible: false
        };
    }
    // ─────────────────────────────────────────────────────────────
    // Carpool Logic
    // ─────────────────────────────────────────────────────────────
    canOpenCarpoolChat(role, ctx) {
        if (role === "driver" && ctx.isOwnerDriver) {
            return { allowed: true };
        }
        if (role === "passenger") {
            // Chat opens immediately when request is submitted
            if (ctx.passengerStatus === "applicant" || ctx.passengerStatus === "confirmed") {
                return { allowed: true };
            }
            if (ctx.passengerStatus === "declined") {
                return { allowed: true }; // Read-only access
            }
        }
        return { allowed: false, reason: "no_access" };
    }
    canSendCarpoolMessage(role, ctx, now) {
        if (role === "driver" && ctx.isOwnerDriver) {
            return { allowed: true };
        }
        if (role === "passenger") {
            if (ctx.passengerStatus === "confirmed") {
                return { allowed: true };
            }
            if (ctx.passengerStatus === "applicant") {
                // Check message delay
                if (ctx.applicantAppliedAt) {
                    const appliedAt = new Date(ctx.applicantAppliedAt);
                    const delaySec = ctx.applicantMessageDelaySec || this.config.applicantMessageDelaySec;
                    const timeSinceApplied = (now.getTime() - appliedAt.getTime()) / 1000;
                    if (timeSinceApplied < delaySec) {
                        return {
                            allowed: false,
                            reason: "message_delay",
                            countdownSec: Math.ceil(delaySec - timeSinceApplied)
                        };
                    }
                }
                return { allowed: true };
            }
            if (ctx.passengerStatus === "declined") {
                return { allowed: false, reason: "request_declined" };
            }
        }
        return { allowed: false, reason: "no_permission" };
    }
    getCarpoolComposerState(role, ctx, sendPermission) {
        if (role === "driver") {
            return {
                disabled: !sendPermission.allowed,
                placeholder: "Write a message..."
            };
        }
        if (role === "passenger") {
            if (ctx.passengerStatus === "declined") {
                return {
                    disabled: true,
                    placeholder: "Request was declined"
                };
            }
            if (!sendPermission.allowed && sendPermission.countdownSec) {
                const minutes = Math.floor(sendPermission.countdownSec / 60);
                const seconds = sendPermission.countdownSec % 60;
                return {
                    disabled: true,
                    placeholder: `You can message the driver in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                    countdownSec: sendPermission.countdownSec,
                    showCountdown: true
                };
            }
            return {
                disabled: !sendPermission.allowed,
                placeholder: sendPermission.allowed ? "Write to driver..." : "Cannot send messages"
            };
        }
        return {
            disabled: true,
            placeholder: "Chat not available"
        };
    }
    getCarpoolPrimaryAction(role, ctx) {
        if (role === "passenger" && ctx.passengerStatus === "declined") {
            return {
                kind: "submit_new_request",
                label: "Submit new request",
                visible: true
            };
        }
        return {
            kind: "none",
            label: "",
            visible: false
        };
    }
    // ─────────────────────────────────────────────────────────────
    // Service Logic
    // ─────────────────────────────────────────────────────────────
    canOpenServiceChat(role, ctx) {
        if (role === "service_client") {
            return { allowed: true }; // Client always sees grouped chat
        }
        if (role === "service_provider") {
            // Provider only sees chat after they've responded
            if (ctx.providerHasResponded) {
                return { allowed: true };
            }
            return { allowed: false, reason: "must_respond_first" };
        }
        return { allowed: false, reason: "no_access" };
    }
    canSendServiceMessage(role, ctx, now) {
        if (ctx.rfqStatus === "closed") {
            return { allowed: false, reason: "rfq_closed" };
        }
        if (role === "service_client") {
            if (ctx.rfqStatus === "provider_selected") {
                // Client can only message selected provider
                return { allowed: true };
            }
            if (ctx.rfqStatus === "collecting" || ctx.rfqStatus === "under_review") {
                return { allowed: true }; // Can broadcast to all providers
            }
        }
        if (role === "service_provider") {
            if (ctx.rfqStatus === "provider_selected") {
                // Only selected provider can continue messaging
                if (ctx.selectedProviderId === ctx.currentUserId) {
                    return { allowed: true };
                }
                return { allowed: false, reason: "not_selected" };
            }
            if (ctx.rfqStatus === "collecting" || ctx.rfqStatus === "under_review") {
                if (ctx.providerHasResponded) {
                    return { allowed: true };
                }
                return { allowed: false, reason: "must_respond_first" };
            }
        }
        return { allowed: false, reason: "no_permission" };
    }
    getServiceComposerState(role, ctx, sendPermission) {
        if (role === "service_client") {
            if (ctx.rfqStatus === "provider_selected") {
                return {
                    disabled: !sendPermission.allowed,
                    placeholder: "Message to selected provider..."
                };
            }
            return {
                disabled: !sendPermission.allowed,
                placeholder: "Broadcast to all providers..."
            };
        }
        if (role === "service_provider") {
            if (ctx.rfqStatus === "provider_selected") {
                if (!sendPermission.allowed && sendPermission.reason === "not_selected") {
                    return {
                        disabled: true,
                        placeholder: "Request closed - not selected"
                    };
                }
            }
            if (!ctx.providerHasResponded) {
                return {
                    disabled: true,
                    placeholder: "Submit an offer to start messaging"
                };
            }
            return {
                disabled: !sendPermission.allowed,
                placeholder: "Reply to client..."
            };
        }
        return {
            disabled: true,
            placeholder: "Chat not available"
        };
    }
    getServicePrimaryAction(role, ctx) {
        if (role === "service_client") {
            if (ctx.rfqStatus === "collecting" || ctx.rfqStatus === "under_review") {
                return {
                    kind: "select_provider",
                    label: "Select provider",
                    visible: true,
                    disabled: false
                };
            }
            if (ctx.rfqStatus === "provider_selected") {
                return {
                    kind: "none",
                    label: "",
                    visible: false
                };
            }
        }
        return {
            kind: "none",
            label: "",
            visible: false
        };
    }
}
// ─────────────────────────────────────────────────────────────
// Singleton instance
// ─────────────────────────────────────────────────────────────
export const chatEligibilityService = new ChatEligibilityServiceImpl();
