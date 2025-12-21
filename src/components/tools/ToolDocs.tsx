import { getTranslations } from "next-intl/server";

interface ToolDocsProps {
  /** The rendered HTML content from the markdown file */
  html: string;
  /** Whether this is a fallback to English (not the user's locale) */
  isFallback: boolean;
}

/**
 * Renders tool documentation below the tool UI.
 * Shows a translation notice if falling back to English.
 */
export async function ToolDocs({ html, isFallback }: ToolDocsProps) {
  const t = await getTranslations("common");

  return (
    <section className="tool-docs mt-8 pt-8 border-t border-border">
      {isFallback && (
        <div className="mb-4 px-4 py-2 rounded text-sm bg-background-muted text-foreground-muted">
          {t("translationNotice")}
        </div>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
