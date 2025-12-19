import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("common");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4">{t("title")}</h1>
      <p className="text-xl text-gray-600 mb-8">{t("tagline")}</p>

      <Link
        href="/tools"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        {t("allTools")}
      </Link>
    </main>
  );
}
