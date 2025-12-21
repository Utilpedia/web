"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { navLinks } from "@/config/navigation";
import { Logo } from "@/components/brand";
import { ProgressLink } from "@/components/utility";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const t = useTranslations("nav");

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--background)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-4">
          <Logo size={28} color="var(--foreground)" />
          <button
            onClick={onClose}
            className="p-2 focus-ring rounded"
            style={{ color: "var(--foreground-muted)" }}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="px-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <ProgressLink
                  href={link.href}
                  onClick={onClose}
                  className="block px-4 py-3 text-lg font-medium rounded focus-ring transition-colors"
                  style={{
                    color: link.isPrimary
                      ? "var(--primary)"
                      : "var(--foreground)",
                  }}
                >
                  {t(link.labelKey)}
                </ProgressLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
