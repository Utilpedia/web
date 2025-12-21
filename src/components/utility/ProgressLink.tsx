"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationProgress } from "./NavigationProgress";
import type { ComponentProps } from "react";

type ProgressLinkProps = ComponentProps<typeof Link>;

/**
 * Extracts pathname from href, handling both string and object forms.
 * Strips query strings and hash fragments.
 */
function getPathname(href: ProgressLinkProps["href"]): string {
  if (typeof href === "string") {
    return href.split("?")[0]?.split("#")[0] ?? "";
  }
  return href.pathname ?? "";
}

/**
 * A Link component that triggers the navigation progress bar.
 * Use this instead of next/link for internal navigation.
 *
 * Shows progress for:
 * - Navigation between different pages
 * - Language switches (e.g., /tools/dice → /es/tools/dice)
 *
 * Does NOT show progress for:
 * - Same page (exact pathname match)
 * - External links
 * - New tab/window (modifier keys)
 * - Hash or query-only changes
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

    // Don't start progress if default was prevented
    if (e.defaultPrevented) return;

    // Don't start progress for modifier key clicks (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Don't start for right-click
    if (e.button !== 0) return;

    const targetPathname = getPathname(href);

    // Don't start progress for external links
    if (targetPathname.startsWith("http") || targetPathname.startsWith("//")) {
      return;
    }

    // Don't start progress for exact same pathname
    // This allows language switches to show progress (different full paths)
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
