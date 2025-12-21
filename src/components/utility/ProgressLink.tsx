"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationProgress } from "./NavigationProgress";
import type { ComponentProps } from "react";

type ProgressLinkProps = ComponentProps<typeof Link>;

/**
 * A Link component that triggers the navigation progress bar.
 * Use this instead of next/link for internal navigation.
 */
export function ProgressLink({
  href,
  onClick,
  children,
  ...props
}: ProgressLinkProps) {
  const { start } = useNavigationProgress();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    onClick?.(e);

    // Don't start progress if:
    // - Default was prevented
    // - It's an external link
    // - It's the current page
    // - Modifier keys are pressed (new tab, etc.)
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const targetUrl = typeof href === "string" ? href : href.pathname || "";

    // Check if it's an external link
    if (targetUrl.startsWith("http") || targetUrl.startsWith("//")) return;

    // Check if it's the current page (including hash changes)
    const targetPathname = targetUrl.split("?")[0]?.split("#")[0];
    if (targetPathname === pathname) return;

    // Start the progress bar
    start();
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
