import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/cmpSECGONow.tsx
import { useMemo, useState } from "react";
import { Car, Navigation, ParkingMeter, Bike, Bus, MapPin, Clock, Calendar, ArrowRight, ArrowUpDown, Crosshair, X, Info, } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { useAvailability } from "../useAvailability";
import { CMPAvailabilityBadge } from "./cmpAvailabilityBadge";
import { noteToText } from "../noteI18n";
/* ========= Quick suggested locations ========= */
function QuickLocationChips({ onPick, }) {
    // ⚙️ Замінюй під своє місто/сценарії
    const presets = [
        {
            label: "Центр → Аеропорт",
            from: "Львів Центр",
            to: "Львів Аеропорт",
        },
        {
            label: "Оперний → Ринок",
            from: "Львів Оперний",
            to: "Площа Ринок",
        },
        {
            label: "Сокільники → Центр",
            from: "Сокільники",
            to: "Львів Центр",
        },
        { label: "Lviv → Kyiv", from: "Lviv", to: "Kyiv" },
    ];
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: presets.map((p) => (_jsx("button", { onClick: () => onPick({ from: p.from, to: p.to }), className: "text-xs rounded-full border px-3 py-1 hover:bg-accent", "aria-label": `Use preset ${p.label}`, children: p.label }, p.label))) }));
}
/* ========= Transport chooser modal ========= */
function ModeChooserModal({ open, onClose, onChoose, availability, loading, t, }) {
    if (!open)
        return null;
    const modes = [
        {
            id: "drive",
            label: t("mode.drive"),
            sub: t("mode.drive.sub"),
            Icon: Car,
        },
        {
            id: "share",
            label: t("mode.share"),
            sub: t("mode.share.sub"),
            Icon: Bus,
        },
        {
            id: "taxi",
            label: t("mode.taxi"),
            sub: t("mode.taxi.sub"),
            Icon: Car,
        },
        {
            id: "scooter",
            label: t("mode.scooter"),
            sub: t("mode.scooter.sub"),
            Icon: Bike,
        },
    ];
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl bg-card text-card-foreground shadow-xl p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: t("choose.transport.title") }), _jsx("p", { className: "text-sm text-muted-foreground", children: t("choose.transport.desc") })] }), _jsx("button", { "aria-label": "Close", onClick: onClose, className: "p-2 rounded-lg hover:bg-accent", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 mt-2", children: modes.map(({ id, label, sub, Icon }) => {
                            const a = availability[id];
                            const disabled = loading || a.status === "na";
                            const noteText = noteToText(a.noteCode, t);
                            return (_jsx("button", { onClick: () => !disabled && onChoose(id), disabled: disabled, className: `rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:bg-accent
                  ${disabled ? "opacity-60 cursor-not-allowed" : ""}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Icon, { className: "h-6 w-6 text-foreground/80 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-sm font-medium", children: label }), _jsx(CMPAvailabilityBadge, { status: a.status, loading: loading })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: sub }), noteText && (_jsxs("div", { className: "mt-1 flex items-center gap-1 text-[11px] text-muted-foreground", children: [_jsx(Info, { className: "h-3.5 w-3.5" }), " ", noteText] }))] })] }) }, id));
                        }) })] })] }));
}
/* ========= Main component ========= */
export function CMPSECGONow({ onStartDrive, onChooseShare, onChooseTaxi, onChooseScooter, onOpenParking, }) {
    const { t, lang } = useI18n();
    // From/To
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    // Date/Time defaults
    const [rideDate, setRideDate] = useState(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    });
    const [rideTime, setRideTime] = useState(() => {
        const d = new Date();
        const minutes = Math.ceil(d.getMinutes() / 5) * 5;
        d.setMinutes(minutes, 0, 0);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    });
    // When ISO
    const whenISO = useMemo(() => {
        if (!rideDate || !rideTime)
            return undefined;
        const [y, m, d] = rideDate.split("-").map(Number);
        const [hh, mm] = rideTime.split(":").map(Number);
        const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
        return dt.toISOString();
    }, [rideDate, rideTime]);
    const hasFrom = from.trim().length > 0;
    const hasTo = to.trim().length > 0;
    const notSamePlace = from.trim() !== to.trim();
    const isFuture = useMemo(() => whenISO
        ? new Date(whenISO).getTime() >= Date.now()
        : false, [whenISO]);
    const canProceed = hasFrom && hasTo && notSamePlace && isFuture;
    // Availability with debounce + loading
    const { availability, loading } = useAvailability(from, to, whenISO, {
        debounceMs: 400,
        // fetcher: myBackendFetcher, // ← сюди легко підключити бекенд
    });
    // Modal state
    const [chooserOpen, setChooserOpen] = useState(false);
    const swapFromTo = () => {
        setFrom((prevFrom) => {
            const nextFrom = to;
            setTo(prevFrom);
            return nextFrom;
        });
    };
    const useCurrentLocation = () => setFrom(t("use.my.location"));
    // Handle mode choose
    const chooseAndGo = (mode) => {
        setChooserOpen(false);
        if (!canProceed)
            return;
        if (mode === "drive")
            onStartDrive?.(from, to, whenISO);
        if (mode === "share")
            onChooseShare?.(from, to, whenISO);
        if (mode === "taxi")
            onChooseTaxi?.(from, to, whenISO);
        if (mode === "scooter")
            onChooseScooter?.(from, to, whenISO);
    };
    // Parking hint
    const parkingHint = useMemo(() => {
        if (!hasTo)
            return null;
        return {
            place: to,
            price: "₴25/год",
            distance: "120 м",
            provider: "CityParking",
        };
    }, [hasTo, to]);
    return (_jsxs("div", { className: "max-w-md mx-auto px-4 space-y-6", children: [_jsxs("div", { className: "rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent", children: _jsx(Navigation, { className: "h-5 w-5 text-accent-foreground" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-lg font-semibold", children: t("go.nowOrPlan") }), _jsx("p", { className: "text-sm text-muted-foreground", children: t("go.hint") })] })] }), _jsx("div", { className: "mt-3", children: _jsx(QuickLocationChips, { onPick: ({ from: f, to: tt }) => {
                                setFrom(f);
                                setTo(tt);
                            } }) }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("label", { className: "rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }), _jsx("input", { value: from, onChange: (e) => setFrom(e.target.value), placeholder: t("from"), "aria-label": t("from"), className: "w-full bg-transparent outline-none" }), !hasFrom && (_jsxs("button", { type: "button", onClick: useCurrentLocation, className: "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1", children: [_jsx(Crosshair, { className: "h-3.5 w-3.5" }), " ", t("use.my.location")] }))] }), _jsx("div", { className: "flex justify-center", children: _jsxs("button", { type: "button", onClick: swapFromTo, className: "mx-auto my-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", "aria-label": t("swap"), children: [_jsx(ArrowUpDown, { className: "h-4 w-4" }), " ", t("swap")] }) }), _jsxs("label", { className: "rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }), _jsx("input", { value: to, onChange: (e) => setTo(e.target.value), placeholder: t("to"), "aria-label": t("to"), className: "w-full bg-transparent outline-none" })] })] }), _jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [_jsxs("label", { className: "rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2", "aria-label": t("date"), children: [_jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "date", value: rideDate, min: rideDate, onChange: (e) => setRideDate(e.target.value), className: "w-full bg-transparent outline-none", lang: lang })] }), _jsxs("label", { className: "rounded-xl border border-border bg-input-background px-3 py-2 flex items-center gap-2", "aria-label": t("time"), children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "time", value: rideTime, onChange: (e) => setRideTime(e.target.value), className: "w-full bg-transparent outline-none", step: 300, lang: lang })] })] }), _jsx("button", { disabled: !canProceed, onClick: () => canProceed && setChooserOpen(true), className: "mt-3 h-12 w-full rounded-xl bg-primary text-primary-foreground transition hover:opacity-95 disabled:opacity-60 flex items-center justify-center", children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [t("build.route"), " ", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "mb-1 text-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: t("choose.mode") }), _jsx("p", { className: "text-sm text-muted-foreground", children: t("share.tip") })] }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                            {
                                id: "drive",
                                Icon: Car,
                                label: t("mode.drive"),
                                sub: t("mode.drive.sub"),
                            },
                            {
                                id: "share",
                                Icon: Bus,
                                label: t("mode.share"),
                                sub: t("mode.share.sub"),
                            },
                            {
                                id: "taxi",
                                Icon: Car,
                                label: t("mode.taxi"),
                                sub: t("mode.taxi.sub"),
                            },
                            {
                                id: "scooter",
                                Icon: Bike,
                                label: t("mode.scooter"),
                                sub: t("mode.scooter.sub"),
                            },
                        ].map(({ id, Icon, label, sub }) => {
                            const a = availability[id];
                            const noteText = noteToText(a.noteCode, t);
                            return (_jsx("button", { disabled: !canProceed || loading || a.status === "na", onClick: () => setChooserOpen(true), className: "group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:bg-accent disabled:opacity-60", "aria-label": label, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Icon, { className: "h-6 w-6 text-foreground/80 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-sm font-medium", children: label }), _jsx(CMPAvailabilityBadge, { status: a.status, loading: loading })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: sub }), noteText && (_jsxs("div", { className: "mt-1 flex items-center gap-1 text-[11px] text-muted-foreground", children: [_jsx(Info, { className: "h-3.5 w-3.5" }), " ", noteText] }))] })] }) }, id));
                        }) })] }), parkingHint && (_jsxs("div", { className: "rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ParkingMeter, { className: "h-5 w-5 text-foreground/80" }), _jsxs("div", { className: "text-sm font-semibold", children: [t("parking.near"), " \u00AB", parkingHint.place, "\u00BB"] })] }), _jsx("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700", children: t("recommended") })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [parkingHint.price, " \u2022 ", parkingHint.distance, " \u2022", " ", parkingHint.provider] }), typeof onOpenParking === "function" && (_jsx("button", { className: "mt-3 h-12 w-full rounded-xl bg-primary text-primary-foreground transition hover:opacity-95 flex items-center justify-center", onClick: () => onOpenParking?.(to, whenISO), children: t("choose.parking") }))] })), _jsx(ModeChooserModal, { open: chooserOpen, onClose: () => setChooserOpen(false), onChoose: chooseAndGo, availability: availability, loading: loading, t: t })] }));
}
