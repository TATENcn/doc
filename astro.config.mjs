// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "http://doc.taten.org",
  base: "/",
  integrations: [
    starlight({
      title: "TATEN Doc",
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
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        { label: "服务文档", autogenerate: { directory: "services" } },
      ],
    }),
  ],
});
