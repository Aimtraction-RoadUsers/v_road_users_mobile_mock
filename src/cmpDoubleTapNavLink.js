import { jsx as _jsx } from "react/jsx-runtime";
// DoubleTapNavLink.tsx
import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function DoubleTapNavLink({ primaryTo, secondaryTo, className, thresholdMs = 280, children, ...rest }) {
    const navigate = useNavigate();
    const loc = useLocation();
    const timerRef = useRef(null);
    const lastTapRef = useRef(0);
    const go = (to) => {
        // Якщо ми вже на цьому ж шляху — зроби "рефреш" або скрол-ап
        if (loc.pathname === to) {
            // варіант А: просто скрол у верх
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
            // варіант B: "ремоунт" — навігація з replace на той самий шлях з no-op query
            // navigate({ pathname: to, search: "?r=1" }, { replace: true });
            return;
        }
        navigate(to);
    };
    const onClick = (e) => {
        e.preventDefault(); // ми самі керуємо навігацією
        const now = Date.now();
        // if second tap within threshold -> double
        if (now - lastTapRef.current < thresholdMs) {
            // це double tap
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            lastTapRef.current = 0;
            go(secondaryTo);
            return;
        }
        // перший tap: ставимо таймер на single
        lastTapRef.current = now;
        timerRef.current = setTimeout(() => {
            go(primaryTo);
            timerRef.current = null;
            lastTapRef.current = 0;
        }, thresholdMs);
    };
    // (додатково) ловимо подвійний клік мишкою на десктопі — щоб не чекати таймер
    const onDoubleClick = (e) => {
        e.preventDefault();
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        lastTapRef.current = 0;
        go(secondaryTo);
    };
    return (_jsx("a", { href: primaryTo, onClick: onClick, onDoubleClick: onDoubleClick, className: className, ...rest, children: children }));
}
