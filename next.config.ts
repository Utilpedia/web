import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Alias @utilpedia/math/* to the stdlib monorepo subpackage
    config.resolve.alias = {
      ...config.resolve.alias,
      "@utilpedia/math": path.resolve(
        __dirname,
        "node_modules/@utilpedia/stdlib/packages/math/dist"
      ),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
