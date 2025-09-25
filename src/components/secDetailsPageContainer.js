import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/DetailsPageContainer.tsx
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Car, Bus, Train, MapPin, Clock, Shield, User, Phone, Info, Sparkles, ChevronRight, Ticket, Luggage, CheckCircle2, X, } from "lucide-react";
export function SECDetailsPageContainer({ mode, offer, loading = false, entryPoint = "card", onBack, onConfirm, onContactDriver, onRedirectProvider, }) {
    const ctaRef = useRef(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    // Автоскрол до CTA якщо зайшли через primaryCta
    useEffect(() => {
        if (entryPoint === "primaryCta" &&
            ctaRef.current &&
            !loading) {
            ctaRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [entryPoint, loading]);
    if (loading)
        return _jsx(DetailSkeleton, { onBack: onBack });
    if (!offer)
        return _jsx(DetailEmpty, { onBack: onBack });
    const Icon = mode === "carpool" ? Car : mode === "bus" ? Bus : Train;
    // Загальні дані
    const from = offer.kind === "carpool"
        ? offer.from
        : offer.kind === "train"
            ? offer.from
            : offer.routeTitle.split(" → ")[0];
    const to = offer.kind === "carpool"
        ? offer.to
        : offer.kind === "train"
            ? offer.to
            : offer.routeTitle.split(" → ")[1];
    const depart = new Date(offer.dateISO);
    const title = offer.kind === "carpool"
        ? `${offer.driver.name} • ${offer.car.model}`
        : offer.kind === "bus"
            ? `${offer.carrierName ?? "Автобус"}`
            : offer.trainTitle;
    const footerCtaLabel = offer.kind === "carpool"
        ? offer.instant
            ? "Миттєво забронювати"
            : "Надіслати запит"
        : offer.kind === "bus"
            ? "Купити квиток"
            : "Купити квиток";
    const handleConfirm = () => {
        if (offer.kind !== "carpool" && onRedirectProvider) {
            // У автобусів/поїздів часто редірект до провайдера
            onRedirectProvider?.(offer.id);
        }
        else if (onConfirm) {
            onConfirm(offer.id);
        }
        setConfirmOpen(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [_jsx("header", { className: "sticky top-0 z-30 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2", children: _jsxs("div", { className: "mx-auto max-w-2xl flex items-center gap-3", children: [_jsx("button", { onClick: onBack, className: "p-2 rounded-lg hover:bg-accent", "aria-label": "\u041D\u0430\u0437\u0430\u0434", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Icon, { className: "h-4 w-4" }), _jsxs("span", { children: [from, " \u2192 ", to] })] })] }) }), _jsxs("div", { className: "mx-auto max-w-2xl px-4 py-4 space-y-6", children: [_jsx("section", { className: "rounded-xl border p-4 shadow-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent", children: _jsx(Icon, { className: "h-5 w-5 text-accent-foreground" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-base font-semibold", children: title }), _jsxs("div", { className: "text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1", children: [_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(MapPin, { className: "h-4 w-4" }), from, " \u2192 ", to] }), _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { className: "h-4 w-4" }), formatDateTime(depart)] }), _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(Ticket, { className: "h-4 w-4" }), offer.priceUAH, " \u0433\u0440\u043D"] }), offer.kind === "carpool" && (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx(User, { className: "h-4 w-4" }), "\u041C\u0456\u0441\u0446\u044C: ", offer.seatsLeft] }))] })] })] }) }), offer.kind === "carpool" && (_jsx(CarpoolSection, { offer: offer, onContactDriver: onContactDriver })), offer.kind === "bus" && _jsx(BusSection, { offer: offer }), offer.kind === "train" && (_jsx(TrainSection, { offer: offer })), offer.provider && (_jsxs("div", { className: "rounded-xl border p-3 text-sm text-muted-foreground flex items-start gap-2", children: [_jsx(Info, { className: "h-4 w-4 mt-0.5" }), " \u041F\u0440\u043E\u043F\u043E\u0437\u0438\u0446\u0456\u044F \u043D\u0430\u0434\u0430\u043D\u0430:", " ", _jsx("span", { className: "ml-1 font-medium text-foreground", children: offer.provider })] })), _jsx("div", { className: "h-20" })] }), _jsx("div", { ref: ctaRef, className: "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur", children: _jsxs("div", { className: "mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-semibold", children: [offer.priceUAH, " \u0433\u0440\u043D"] }), _jsx("div", { className: "text-muted-foreground text-xs", children: "\u0412\u043A\u043B\u044E\u0447\u0430\u0454 \u0431\u0430\u0437\u043E\u0432\u0456 \u0437\u0431\u043E\u0440\u0438" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [offer.kind === "carpool" && (_jsxs("button", { onClick: () => onContactDriver?.(offer.id), className: "hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent", children: [_jsx(Phone, { className: "h-4 w-4" }), " \u041D\u0430\u043F\u0438\u0441\u0430\u0442\u0438 \u0432\u043E\u0434\u0456\u044E"] })), _jsxs("button", { onClick: () => setConfirmOpen(true), className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95", children: [_jsx(Sparkles, { className: "h-4 w-4" }), " ", footerCtaLabel] })] })] }) }), _jsx(QuickConfirmSheet, { open: confirmOpen, onClose: () => setConfirmOpen(false), title: footerCtaLabel, lines: buildConfirmLines(offer), onConfirm: handleConfirm })] }));
}
/* ============== Sections ============== */
function CarpoolSection({ offer, onContactDriver, }) {
    return (_jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-xl border p-4", children: [_jsxs("div", { className: "mb-2 text-sm font-semibold flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4" }), " \u0412\u043E\u0434\u0456\u0439"] }), _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-medium", children: [offer.driver.name, " ", offer.driver.verified && (_jsx(Shield, { className: "inline h-4 w-4 text-emerald-600 ml-1" }))] }), _jsxs("div", { className: "text-muted-foreground", children: ["\u0420\u0435\u0439\u0442\u0438\u043D\u0433: ", offer.driver.rating ?? "—", " \u2022 \u041F\u043E\u0457\u0437\u0434\u043E\u043A:", " ", offer.driver.trips ?? "—"] })] }), onContactDriver && (_jsxs("button", { onClick: () => onContactDriver(offer.id), className: "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs hover:bg-accent", children: [_jsx(Phone, { className: "h-4 w-4" }), " \u041D\u0430\u043F\u0438\u0441\u0430\u0442\u0438"] }))] })] }), _jsxs("div", { className: "rounded-xl border p-4", children: [_jsxs("div", { className: "mb-1 text-sm font-semibold flex items-center gap-2", children: [_jsx(Car, { className: "h-4 w-4" }), " \u0410\u0432\u0442\u043E"] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [offer.car.model, offer.car.color ? ` • ${offer.car.color}` : ""] })] }), (offer.rules?.length || offer.baggage || offer.note) && (_jsxs("div", { className: "rounded-xl border p-4 space-y-2", children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: "\u0423\u043C\u043E\u0432\u0438 \u043F\u043E\u0457\u0437\u0434\u043A\u0438" }), offer.rules?.length ? (_jsx("ul", { className: "list-disc pl-5 text-sm text-muted-foreground space-y-0.5", children: offer.rules.map((r, i) => (_jsx("li", { children: r }, i))) })) : null, offer.baggage && (_jsxs("div", { className: "text-sm text-muted-foreground inline-flex items-center gap-2", children: [_jsx(Luggage, { className: "h-4 w-4" }), " \u0411\u0430\u0433\u0430\u0436:", " ", offer.baggage] })), offer.note && (_jsxs("div", { className: "text-sm text-muted-foreground inline-flex items-start gap-2", children: [_jsx(Info, { className: "h-4 w-4 mt-0.5" }), " ", offer.note] }))] }))] }));
}
function BusSection({ offer }) {
    return (_jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-xl border p-4", children: [_jsxs("div", { className: "mb-1 text-sm font-semibold flex items-center gap-2", children: [_jsx(Bus, { className: "h-4 w-4" }), " \u041F\u0435\u0440\u0435\u0432\u0456\u0437\u043D\u0438\u043A"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: offer.carrierName ?? "—" })] }), (offer.refundPolicy || offer.luggage) && (_jsxs("div", { className: "rounded-xl border p-4 space-y-2", children: [_jsx("div", { className: "text-sm font-semibold", children: "\u0423\u043C\u043E\u0432\u0438" }), offer.refundPolicy && (_jsxs("div", { className: "text-sm text-muted-foreground", children: [_jsx(Shield, { className: "inline h-4 w-4 mr-1" }), " ", offer.refundPolicy] })), offer.luggage && (_jsxs("div", { className: "text-sm text-muted-foreground", children: [_jsx(Luggage, { className: "inline h-4 w-4 mr-1" }), " ", offer.luggage] }))] })), offer.seatSelection && (_jsxs("div", { className: "rounded-xl border p-4 text-sm text-muted-foreground flex items-center justify-between", children: ["\u0412\u0438\u0431\u0456\u0440 \u043C\u0456\u0441\u0446\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439", _jsxs("button", { className: "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-accent", children: ["\u041E\u0431\u0440\u0430\u0442\u0438 ", _jsx(ChevronRight, { className: "h-3.5 w-3.5" })] })] }))] }));
}
function TrainSection({ offer }) {
    return (_jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-xl border p-4", children: [_jsxs("div", { className: "mb-1 text-sm font-semibold flex items-center gap-2", children: [_jsx(Train, { className: "h-4 w-4" }), " \u041F\u043E\u0442\u044F\u0433"] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [offer.trainTitle, offer.carriageType ? ` • ${offer.carriageType}` : ""] })] }), (offer.refundPolicy || offer.seatSelection) && (_jsxs("div", { className: "rounded-xl border p-4 space-y-2", children: [_jsx("div", { className: "text-sm font-semibold", children: "\u0423\u043C\u043E\u0432\u0438" }), offer.refundPolicy && (_jsxs("div", { className: "text-sm text-muted-foreground", children: [_jsx(Shield, { className: "inline h-4 w-4 mr-1" }), " ", offer.refundPolicy] })), offer.seatSelection && (_jsx("div", { className: "text-sm text-muted-foreground", children: "\u0412\u0438\u0431\u0456\u0440 \u043C\u0456\u0441\u0446\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439" }))] }))] }));
}
/* ============== QuickConfirmSheet ============== */
function QuickConfirmSheet({ open, onClose, title, lines, onConfirm, }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl bg-card text-card-foreground shadow-xl p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("div", { className: "text-lg font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg hover:bg-accent", "aria-label": "\u0417\u0430\u043A\u0440\u0438\u0442\u0438", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "space-y-2 text-sm", children: lines.map((l, i) => (_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("div", { className: "text-muted-foreground", children: l.label }), _jsx("div", { className: "font-medium text-right", children: l.value })] }, i))) }), _jsxs("div", { className: "mt-4 flex items-center justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "rounded-lg border px-3 py-2 text-sm hover:bg-accent", children: "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438" }), _jsxs("button", { onClick: onConfirm, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95", children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), " \u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438"] })] })] })] }));
}
function buildConfirmLines(offer) {
    const lines = [];
    const depart = new Date(offer.dateISO);
    lines.push({
        label: "Маршрут",
        value: offer.kind === "carpool"
            ? `${offer.from} → ${offer.to}`
            : offer.kind === "train"
                ? `${offer.from} → ${offer.to}`
                : offer.routeTitle,
    });
    lines.push({
        label: "Відправлення",
        value: formatDateTime(depart),
    });
    lines.push({ label: "Ціна", value: `${offer.priceUAH} грн` });
    if (offer.kind === "carpool") {
        lines.push({ label: "Водій", value: offer.driver.name });
        lines.push({
            label: "Місць",
            value: String(offer.seatsLeft),
        });
    }
    return lines;
}
/* ============== Skeleton / Empty ============== */
function DetailSkeleton({ onBack }) {
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx("header", { className: "sticky top-0 -mx-4 border-b bg-background/80 backdrop-blur px-4 py-2", children: _jsxs("div", { className: "mx-auto max-w-2xl flex items-center gap-3", children: [_jsx("button", { onClick: onBack, className: "p-2 rounded-lg hover:bg-accent", "aria-label": "\u041D\u0430\u0437\u0430\u0434", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsx("div", { className: "h-4 w-40 rounded bg-muted animate-pulse" })] }) }), _jsx("div", { className: "mx-auto max-w-2xl px-4 py-4 space-y-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: "h-20 rounded-xl border bg-muted/30 animate-pulse" }, i))) })] }));
}
function DetailEmpty({ onBack }) {
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center text-center px-6", children: [_jsx("div", { className: "mb-3 text-lg font-semibold", children: "\u0426\u044E \u043F\u0440\u043E\u043F\u043E\u0437\u0438\u0446\u0456\u044E \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "\u041C\u043E\u0436\u043B\u0438\u0432\u043E, \u0457\u0457 \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E \u0430\u0431\u043E \u0447\u0430\u0441 \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043C\u0438\u043D\u0443\u0432." }), _jsx("button", { onClick: onBack, className: "mt-4 rounded-lg border px-3 py-2 text-sm hover:bg-accent", children: "\u041D\u0430\u0437\u0430\u0434 \u0434\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0456\u0432" })] }));
}
/* ============== Utils ============== */
function formatDateTime(d) {
    try {
        const dd = d.toLocaleString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        return dd.replace(",", " •");
    }
    catch {
        return d.toISOString();
    }
}
// ================= Mock usage example =================
// Можеш створити окремий файл src/mocks/mobilityDetails.ts і звідти брати пропозиції для тесту.
export const mockCarpoolDetail = {
    kind: "carpool",
    id: "c1",
    from: "Львів",
    to: "Київ",
    dateISO: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    priceUAH: 150,
    seatsLeft: 2,
    driver: {
        name: "Іван",
        rating: 4.9,
        trips: 132,
        phoneMasked: "+380••• •• ••",
        verified: true,
    },
    car: { model: "Skoda Fabia", color: "срібний" },
    rules: ["Без куріння", "Тихо", "Без тварин"],
    baggage: "1 місце невеликий рюкзак",
    note: "Зустрінемось біля Оперного",
    provider: "VPidsadka",
    instant: true,
};
export const mockBusDetail = {
    kind: "bus",
    id: "b1",
    routeTitle: "Львів → Київ",
    dateISO: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    arrivalISO: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    priceUAH: 350,
    carrierId: "flix",
    carrierName: "FlixBus",
    refundPolicy: "Повернення за 24 год до відправлення з комісією",
    luggage: "1 місце 20кг + ручна кладь",
    seatSelection: true,
    provider: "AggregatorX",
};
export const mockTrainDetail = {
    kind: "train",
    id: "t1",
    trainTitle: "Інтерсіті №743",
    from: "Львів",
    to: "Київ",
    dateISO: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
    arrivalISO: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    priceUAH: 600,
    carriageType: "2-й клас",
    seatSelection: false,
    provider: "Укрзалізниця",
    refundPolicy: "Повернення відповідно до правил УЗ",
};
