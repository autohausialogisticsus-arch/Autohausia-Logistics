import { SERVICES } from "@/lib/services";

describe("sitemap and robots", () => {
  afterEach(() => {
    delete process.env.SITE_URL;
  });

  it("emits no absolute URLs when SITE_URL is not configured", () => {
    delete process.env.SITE_URL;
    jest.resetModules();
    const { default: sitemap } = require("@/app/sitemap");
    const { default: robots } = require("@/app/robots");
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: [{ userAgent: "*", allow: "/" }] });
  });

  it("uses the configured SITE_URL host and lists all marked pages", () => {
    process.env.SITE_URL = "https://dispatch.example.com";
    jest.resetModules();
    const { default: sitemap } = require("@/app/sitemap");
    const { default: robots } = require("@/app/robots");

    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries as { url: string }[]) {
      expect(entry.url.startsWith("https://dispatch.example.com")).toBe(true);
    }
    const urls = (entries as { url: string }[]).map((e) => e.url);
    expect(urls).toContain("https://dispatch.example.com/");
    expect(urls).toContain("https://dispatch.example.com/services");
    expect(urls).toContain("https://dispatch.example.com/apply");

    for (const service of SERVICES) {
      expect(urls).toContain(
        `https://dispatch.example.com/services/${service.slug}-dispatch`
      );
    }

    const robotsValue = robots();
    expect(robotsValue.sitemap).toBe("https://dispatch.example.com/sitemap.xml");
  });
});