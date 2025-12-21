"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";

// Context to allow triggering progress from anywhere (e.g., Link clicks)
interface NavigationProgressContextType {
  start: () => void;
  done: () => void; // For manual completion (e.g., after error)
}

const NavigationProgressContext = createContext<NavigationProgressContextType>({
  start: () => {},
  done: () => {},
});

export function useNavigationProgress() {
  return useContext(NavigationProgressContext);
}

interface NavigationProgressProviderProps {
  children: React.ReactNode;
}

// Minimum time the bar should be visible (ms)
const MIN_DISPLAY_TIME = 300;
// Starting progress percentage (visible immediately)
const INITIAL_PROGRESS = 10;

export function NavigationProgressProvider({
  children,
}: NavigationProgressProviderProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Use refs for values needed in effects to avoid stale closures
  const isNavigatingRef = useRef(false);
  const startTimeRef = useRef(0);
  const prevPathnameRef = useRef(pathname);

  // Start navigation progress - uses flushSync to ensure immediate render
  // This is critical for slow networks where React might batch updates
  const start = useCallback(() => {
    isNavigatingRef.current = true;
    startTimeRef.current = Date.now();
    // Force synchronous render so progress bar appears immediately
    // before Next.js starts blocking with navigation fetch
    flushSync(() => {
      setIsNavigating(true);
      setProgress(INITIAL_PROGRESS);
    });
  }, []);

  // Manually complete progress (e.g., after navigation error)
  const done = useCallback(() => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;
    setProgress(100);
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
  }, []);

  // Complete navigation when pathname changes
  useEffect(() => {
    // Skip initial mount
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    // Only complete if we were navigating
    if (!isNavigatingRef.current) return;

    // Calculate how long we've been showing the bar
    const elapsed = Date.now() - startTimeRef.current;
    const remainingMinTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    // Delay completion to ensure bar is visible for minimum time
    const completeTimer = setTimeout(() => {
      setProgress(100);
    }, remainingMinTime);

    // Reset after completion animation
    const resetTimer = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
      setProgress(0);
    }, remainingMinTime + 200); // 200ms for the completion animation

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(resetTimer);
    };
  }, [pathname]);

  // Animate progress while navigating
  useEffect(() => {
    if (!isNavigating || progress >= 90) return;

    // Quick initial progress, then slow down
    const increment = progress < 30 ? 12 : progress < 60 ? 6 : 2;
    const delay = progress < 30 ? 80 : progress < 60 ? 150 : 300;

    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + increment, 90));
    }, delay);

    return () => clearTimeout(timer);
  }, [isNavigating, progress]);

  return (
    <NavigationProgressContext.Provider value={{ start, done }}>
      {/* Progress Bar Container */}
      <div
        aria-hidden="true"
        className={`
          fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none
          transition-opacity duration-200 ease-out
          ${isNavigating ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Progress Bar */}
        <div
          className="h-full transition-[width] ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--primary)",
            transitionDuration: progress === 100 ? "150ms" : "200ms",
          }}
        />
      </div>
      {children}
    </NavigationProgressContext.Provider>
  );
}
