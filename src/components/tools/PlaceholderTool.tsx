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
      <h1 className="text-3xl font-bold text-foreground">{name}</h1>

      {description && (
        <p className="text-lg text-foreground-muted">{description}</p>
      )}

      <div className="rounded-lg p-8 text-center bg-background-muted border-2 border-dashed border-border">
        <div className="text-5xl mb-4" role="img" aria-label="Construction">
          🚧
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">
          {t("comingSoon")}
        </h2>
      </div>
    </div>
  );
}
