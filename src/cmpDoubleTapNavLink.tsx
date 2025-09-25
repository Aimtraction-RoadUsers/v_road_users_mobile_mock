// DoubleTapNavLink.tsx
import { type PropsWithChildren, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  primaryTo: string; // куди вести на одиночний клік (локальний home)
  secondaryTo: string; // куди вести на подвійний клік (main home)
  className?: string;
  thresholdMs?: number; // інтервал для double tap, дефолт 250–300мс
  "aria-label"?: string;
};

export default function DoubleTapNavLink({
  primaryTo,
  secondaryTo,
  className,
  thresholdMs = 280,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const loc = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastTapRef = useRef<number>(0);

  const go = (to: string) => {
    // Якщо ми вже на цьому ж шляху — зроби "рефреш" або скрол-ап
    if (loc.pathname === to) {
      // варіант А: просто скрол у верх
      window.scrollTo({
        top: 0,
        behavior: "instant" as ScrollBehavior,
      });

      // варіант B: "ремоунт" — навігація з replace на той самий шлях з no-op query
      // navigate({ pathname: to, search: "?r=1" }, { replace: true });
      return;
    }
    navigate(to);
  };

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
  const onDoubleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastTapRef.current = 0;
    go(secondaryTo);
  };

  return (
    <a
      href={primaryTo}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}