// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "http://doc.taten.org/zh-cn",
  integrations: [
    starlight({
      title: "TATEN Doc",
      defaultLocale: "zh-cn",
      locales: {
        en: {
          label: "English",
          lang: "en",
        },
        // 简体中文文档在 `src/content/docs/zh-cn/` 中。
        "zh-cn": {
          label: "简体中文",
          lang: "zh-CN",
        },
      },
      description: "TATEN Team Documentation Hub Website",
      logo: {
        src: "./src/assets/taten-logo.png",
        alt: "TATEN Logo",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "指南",
          translations: {
            en: "Guides",
          },
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "示例指南",
              translations: {
                en: "Example Guide",
              },
              slug: "guides/example",
            },
          ],
        },
        {
          label: "参考",
          translations: {
            en: "Reference",
          },
          autogenerate: { directory: "reference" },
        },
        {
          label: "服务文档",
          translations: {
            en: "Service Documentation",
          },
          autogenerate: { directory: "services" },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/TATENcn/doc/edit/main/",
      },
    }),
  ],
});
