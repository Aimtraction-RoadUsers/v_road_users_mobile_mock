import { useEffect, useMemo, useRef, useState } from "react";
// ⚙️ За замовчуванням — симулятор. Замінюй через options.fetcher
async function simulateAvailabilityFetcher({ from, to, whenISO, }) {
    const hour = whenISO
        ? new Date(whenISO).getHours()
        : new Date().getHours();
    const txt = `${from}|${to}`.toLowerCase();
    const isNight = hour >= 23 || hour < 5;
    const isAirport = /airport|аеропорт/.test(txt);
    const isCenter = /центр|center|ринок/.test(txt);
    const longTripHint = /київ|lviv|львів|kyiv|odessa|одеса|варшава|warsaw/.test(txt);
    const base = {
        drive: { status: "available" },
        share: { status: "available" },
        taxi: { status: "available" },
        scooter: { status: "available" },
    };
    if (isNight)
        base.scooter = { status: "na", noteCode: "scooters_night" };
    if (longTripHint)
        base.scooter = {
            status: "na",
            noteCode: "scooters_too_long",
        };
    if (isNight)
        base.share = {
            status: "limited",
            noteCode: "share_night_few_drivers",
        };
    if (!isAirport && !isCenter && isNight) {
        base.taxi = {
            status: "limited",
            noteCode: "taxi_night_longer_eta",
        };
    }
    if (!to.trim()) {
        base.taxi = { status: "na", noteCode: "set_destination" };
        base.scooter = {
            status: "na",
            noteCode: "set_destination",
        };
    }
    // імітуємо мережеву затримку
    await new Promise((r) => setTimeout(r, 300));
    return base;
}
/** useAvailability — рахує доступність з дебаунсом і loading */
export function useAvailability(from, to, whenISO, options = {}) {
    const { debounceMs = 400, fetcher = simulateAvailabilityFetcher, } = options;
    const [availability, setAvailability] = useState(() => ({
        drive: { status: "available" },
        share: { status: "available" },
        taxi: { status: "na", noteCode: "set_destination" },
        scooter: { status: "na", noteCode: "set_destination" },
    }));
    const [loading, setLoading] = useState(false);
    const abortRef = useRef(null);
    const deps = useMemo(() => ({ from, to, whenISO }), [from, to, whenISO]);
    useEffect(() => {
        const id = setTimeout(async () => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            setLoading(true);
            try {
                const res = await fetcher({
                    from: deps.from,
                    to: deps.to,
                    whenISO: deps.whenISO,
                });
                setAvailability(res);
            }
            catch (_e) {
                // тут можна показати тост/лог
            }
            finally {
                setLoading(false);
            }
        }, debounceMs);
        return () => clearTimeout(id);
    }, [deps, debounceMs, fetcher]);
    return { availability, loading };
}
