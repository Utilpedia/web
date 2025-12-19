"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Wordmark } from "@/components/brand/Wordmark";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";
import { navLinks } from "@/config/navigation";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <>
      {/* Top utility bar with language selector */}
      <TopBar />

      <header className="flex items-center border-b h-16 full-bleed">
        <div className="content-container flex items-center justify-between">
          {/* Logo/Wordmark */}
          <Link href="/" className="flex h-full items-center focus-ring">
            <Wordmark
              color="var(--foreground)"
              width="auto"
              height={20}
              className=""
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium focus-ring rounded px-1"
                style={{
                  color: link.isPrimary
                    ? "var(--primary)"
                    : "var(--foreground-muted)",
                }}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 focus-ring rounded"
            style={{ color: "var(--foreground-muted)" }}
            aria-label="Open menu"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen(true)}
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Slide-out */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
