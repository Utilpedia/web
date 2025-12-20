import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone output for Azure/Docker deployment
  // Creates minimal self-contained build at .next/standalone
  output: "standalone",

  webpack: (config) => {
    // The stdlib monorepo installs the whole repo, so we alias to the actual package
    config.resolve.alias = {
      ...config.resolve.alias,
      "@utilpedia/math": path.resolve(
        __dirname,
        "node_modules/@utilpedia/math/packages/math/dist"
      ),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
