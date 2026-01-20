import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/workspace", "/playground"],
      },
    ],
    sitemap: "https://codecraft.shaileshiitr.site/sitemap.xml",
  };
}
