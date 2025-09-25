import { useEffect, useRef, useState } from "react";
export function useStickyHeader(threshold = 12) {
    const lastY = useRef(0);
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || 0;
            const dy = y - lastY.current;
            if (Math.abs(dy) > threshold) {
                // вниз і не на самому топі → ховай
                setHidden(dy > 0 && y > 48);
                lastY.current = y;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);
    return { hidden };
}
