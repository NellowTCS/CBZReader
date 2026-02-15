import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";
import path from "path";

// SVG inliner plugin: inlines all icons as CSS variables
function inlineIconsPlugin(options = {}) {
  const iconsDir = options.iconsDir || "src/assets";

  return {
    name: "inline-icons",
    enforce: "post",
    transformIndexHtml(html) {
      const icons = [
        "book",
        "upload",
        "settings",
        "list",
        "arrow-up",
        "welcome",
      ];
      let cssVars = ":root {\n";

      icons.forEach((name) => {
        const svgPath = path.join(iconsDir, `icon-${name}.svg`);
        if (fs.existsSync(svgPath)) {
          let svgContent = fs.readFileSync(svgPath, "utf8");
          // Remove XML header and minify
          svgContent = svgContent
            .replace(/<\?xml[^>]*>\s*/g, "")
            .replace(/\s+/g, " ")
            .replace(/"/g, "'");
          // Base64 encode
          const base64 = Buffer.from(svgContent).toString("base64");
          cssVars += `  --icon-${name}: url("data:image/svg+xml;base64,${base64}");\n`;
        }
      });

      cssVars += "}\n";

      // Inject as inline style
      return html.replace(/<head>(.*?)/, `<head><style>${cssVars}</style>$1`);
    },
  };
}

// SVG favicon inliner plugin
function inlineSvgFaviconPlugin(options) {
  return {
    name: "inline-svg-favicon",
    enforce: "post",
    transformIndexHtml(html) {
      if (!fs.existsSync(options.svg)) return html;
      let svgContent = fs.readFileSync(options.svg, "utf8");
      // Remove XML header if present, minify spaces
      svgContent = svgContent
        .replace(/<\?xml[^>]*>\s*/g, "")
        .replace(/\s+/g, " ");
      // Base64 encode the SVG
      const base64 = Buffer.from(svgContent).toString("base64");
      const faviconTag = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${base64}"/>\n`;
      // Insert favicon into <head>
      return html.replace(/<head>(.*?)/, `<head>$1\n  ${faviconTag}`);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");
  const isSingleFile = env.SINGLE_FILE === "true";

  return {
    base: "./",
    plugins: [
      inlineIconsPlugin(),
      !isSingleFile &&
        VitePWA({
          registerType: "autoUpdate",
          includeAssets: ["robots.txt"],
          manifest: {
            name: "CBZReader",
            short_name: "CBZReader",
            start_url: "./",
            display: "standalone",
            theme_color: "#00bfff",
            background_color: "#00bfff",
          },
          pwaAssets: {
            config: true,
          },
          workbox: {
            globPatterns: ["**/*.{js,css,html,png,ico,json}"],
            runtimeCaching: [
              {
                urlPattern: /.*\.(js|css|html)$/,
                handler: "NetworkFirst",
                options: { cacheName: "app-shell" },
              },
              {
                urlPattern: /.*\.(png|ico|json)$/,
                handler: "CacheFirst",
                options: { cacheName: "assets" },
              },
            ],
          },
        }),
      isSingleFile && viteSingleFile(),
      isSingleFile && inlineSvgFaviconPlugin({ svg: "public/favicon.svg" }),
    ].filter(Boolean),

    build: {
      sourcemap: !isSingleFile,
      copyPublicDir: !isSingleFile,
      outDir: "./dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
    },
  };
});
