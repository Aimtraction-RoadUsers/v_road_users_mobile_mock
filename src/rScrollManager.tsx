// src/router/ScrollManager.tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Пам'ятає scrollY за location.key (тобто працює back/forward),
 * і скидає скрол при звичайній навігації.
 */
export function ScrollManager() {
  const loc = useLocation();
  const positions = useRef(new Map<string, number>());

  useEffect(() => {
    // спроба відновити
    const saved = positions.current.get(loc.key);
    if (typeof saved === "number") {
      window.scrollTo(0, saved);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    return () => {
      positions.current.set(loc.key, window.scrollY);
    };
  }, [loc.key, loc.pathname, loc.search]);

  return null;
}
