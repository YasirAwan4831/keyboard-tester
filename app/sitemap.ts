import type { MetadataRoute } from "next";

const SITE_URL = "https://keyboard-tester.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/typing-test", "/stats", "/about", "/privacy"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
