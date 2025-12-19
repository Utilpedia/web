"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { tools } from "@/features/tool-registry/registry";
import { defaultLocale } from "@/i18n/config";

const MAX_TOOLS = 60;

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("tools");
  const tCommon = useTranslations("common");
  const displayTools = tools.slice(0, MAX_TOOLS);

  // Generate locale-aware href
  const getToolHref = (slug: string) =>
    locale === defaultLocale ? `/tools/${slug}` : `/${locale}/tools/${slug}`;

  // Helper to get translated name, falling back to registry
  const getToolName = (slug: string, fallback: string) => {
    try {
      // Check if translation exists using has()
      if (t.has(`${slug}.name`)) {
        return t(`${slug}.name`);
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <aside
      className="w-52 shrink-0 overflow-y-auto"
      style={{
        border: "1px solid var(--border)",
        maxHeight: "calc(100vh - 200px)",
      }}
      aria-label="Tools navigation"
    >
      <nav className="p-2">
        <h2
          className="px-2 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--foreground-subtle)" }}
        >
          {tCommon("tools")} ({tools.length})
        </h2>
        <ul className="mt-1 space-y-0.5">
          {displayTools.map((tool) => {
            const isActive =
              pathname === `/tools/${tool.slug}` ||
              pathname.endsWith(`/tools/${tool.slug}`);

            return (
              <li key={tool.slug}>
                <Link
                  href={getToolHref(tool.slug)}
                  className="block px-2 py-1.5 text-sm rounded focus-ring transition-colors"
                  style={{
                    backgroundColor: isActive
                      ? "var(--background-muted)"
                      : "transparent",
                    color: isActive
                      ? "var(--foreground)"
                      : "var(--foreground-muted)",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {getToolName(tool.slug, tool.name)}
                </Link>
              </li>
            );
          })}
        </ul>

        {tools.length > MAX_TOOLS && (
          <Link
            href={locale === defaultLocale ? "/tools" : `/${locale}/tools`}
            className="block px-2 py-1.5 mt-2 text-sm focus-ring"
            style={{ color: "var(--primary)" }}
          >
            {tCommon("allTools")} →
          </Link>
        )}
      </nav>
    </aside>
  );
}
