import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next-intl for tests
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  getTranslations: () => async () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock("next-intl/server", () => ({
  getLocale: () => Promise.resolve("en"),
  getMessages: () => Promise.resolve({}),
  getTranslations: () => async () => (key: string) => key,
}));
