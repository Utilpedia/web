"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import { usePathname } from "next/navigation";

// Context to allow triggering progress from anywhere (e.g., Link clicks)
interface NavigationProgressContextType {
  start: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextType>({
  start: () => {},
});

export function useNavigationProgress() {
  return useContext(NavigationProgressContext);
}

interface NavigationProgressProviderProps {
  children: React.ReactNode;
}

export function NavigationProgressProvider({
  children,
}: NavigationProgressProviderProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const isNavigatingRef = useRef(false);

  // Keep ref in sync for use in effects
  useEffect(() => {
    isNavigatingRef.current = isNavigating;
  }, [isNavigating]);

  // Start navigation progress
  const start = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);
  }, []);

  // Complete navigation when pathname changes
  useEffect(() => {
    // Only complete if we were navigating
    if (!isNavigatingRef.current) return;

    // Use setTimeout to defer setState - this avoids the "cascading renders" warning
    // by making the state update asynchronous (as a callback from external system)
    const completeTimer = setTimeout(() => {
      setProgress(100);
    }, 0);

    const resetTimer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(resetTimer);
    };
     
  }, [pathname]); // Intentionally only depend on pathname

  // Animate progress while navigating
  useEffect(() => {
    if (!isNavigating || progress >= 90) return;

    // Quick initial progress, then slow down
    const increment = progress < 30 ? 15 : progress < 60 ? 8 : 3;
    const delay = progress < 30 ? 50 : progress < 60 ? 100 : 200;

    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + increment, 90));
    }, delay);

    return () => clearTimeout(timer);
  }, [isNavigating, progress]);

  return (
    <NavigationProgressContext.Provider value={{ start }}>
      {/* Progress Bar */}
      <div
        className="navigation-progress-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: isNavigating ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      >
        <div
          className="navigation-progress-bar"
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "var(--primary)",
            boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)",
            transition:
              progress === 100
                ? "width 100ms ease-out"
                : "width 200ms ease-out",
          }}
        />
      </div>
      {children}
    </NavigationProgressContext.Provider>
  );
}
