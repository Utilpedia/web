"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect on client, useEffect on server (SSR)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scrolls to top of page on route changes.
 * Place this component in a layout to ensure scroll resets on navigation.
 *
 * Uses useLayoutEffect to scroll before paint, preventing flicker.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser's scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on route change - before paint
  useIsomorphicLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
