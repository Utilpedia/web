import { getTranslations } from "next-intl/server";

interface PlaceholderToolProps {
  name: string;
  description?: string;
}

export async function PlaceholderTool({
  name,
  description,
}: PlaceholderToolProps) {
  const t = await getTranslations("common");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
        {name}
      </h1>

      {description && (
        <p className="text-lg" style={{ color: "var(--foreground-muted)" }}>
          {description}
        </p>
      )}

      <div
        className="rounded-lg p-8 text-center"
        style={{
          backgroundColor: "var(--background-muted)",
          border: "2px dashed var(--border)",
        }}
      >
        <div className="text-5xl mb-4" role="img" aria-label="Construction">
          🚧
        </div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("comingSoon")}
        </h2>
      </div>
    </div>
  );
}
