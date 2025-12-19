/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://utilpedia.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Add tool routes statically
  // Update this list when adding new tools
  additionalPaths: async () => {
    const toolSlugs = [
      "dice-roller",
      // Add new tool slugs here
    ];

    return toolSlugs.map((slug) => ({
      loc: `/tools/${slug}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
