import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FieldFirst",
    short_name: "FieldFirst",
    description: "Field-first construction operating system prototype",
    start_url: "/feed",
    display: "standalone",
    background_color: "#121311",
    theme_color: "#121311",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
