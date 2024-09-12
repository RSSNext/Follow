// electron.vite.config.ts
// scripts/lib.ts
import { execSync } from "node:child_process";
// configs/vite.render.config.ts
import { readFileSync } from "node:fs";
import { resolve,resolve as resolve2  } from "node:path";

import * as babel from "@babel/core";
import generate from "@babel/generator";
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { prerelease } from "semver";

var getGitHash = () => {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch (e) {
    console.error("Failed to get git hash", e);
    return "";
  }
};

// configs/vite.render.config.ts
var pkg = JSON.parse(readFileSync("package.json", "utf8"));
var isCI = process.env.CI === "true" || process.env.CI === "1";
var viteRenderBaseConfig = {
  resolve: {
    alias: {
      "@renderer": resolve("src/renderer/src"),
      "@shared": resolve("src/shared/src"),
      "@pkg": resolve("./package.json"),
      "@env": resolve("./src/env.ts"),
      "@locales": resolve("./locales")
    }
  },
  base: "/",
  plugins: [
    react(),
    sentryVitePlugin({
      org: "follow-rg",
      project: "follow",
      disable: !isCI,
      bundleSizeOptimizations: {
        excludeDebugStatements: true,
        // Only relevant if you added `browserTracingIntegration`
        excludePerformanceMonitoring: true,
        // Only relevant if you added `replayIntegration`
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true
      },
      moduleMetadata: {
        appVersion: process.env.NODE_ENV === "development" ? "dev" : pkg.version,
        electron: false
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ["out/web/assets/*.js.map"]
      }
    }),
    viteTwToRawString(),
    {
      name: "custom-i18n-hmr",
      handleHotUpdate({ file, server }) {
        if (file.endsWith(".json") && file.includes("locales")) {
          server.ws.send({
            type: "custom",
            event: "i18n-update",
            data: {
              file,
              content: readFileSync(file, "utf-8")
            }
          });
          return [];
        }
      }
    }
  ],
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    APP_NAME: JSON.stringify(pkg.name),
    APP_DEV_CWD: JSON.stringify(process.cwd()),
    GIT_COMMIT_SHA: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || getGitHash()),
    RELEASE_CHANNEL: JSON.stringify(prerelease(pkg.version)?.[0] || "stable"),
    DEBUG: process.env.DEBUG === "true"
  }
};
function viteTwToRawString() {
  return {
    name: "vite-plugin-tw-to-raw-string",
    transform(code, id) {
      if (!/\.[jt]sx?$/.test(id)) {
        return null;
      }
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
        // Add typescript support
      });
      babel.traverse(ast, {
        TaggedTemplateExpression(path) {
          if (t.isIdentifier(path.node.tag, { name: "tw" })) {
            const { quasi } = path.node;
            if (t.isTemplateLiteral(quasi)) {
              const quasis = quasi.quasis.map((q) => q.value.raw);
              path.replaceWith(
                t.templateLiteral(
                  quasis.map(
                    (q, i) => t.templateElement({ raw: q, cooked: q }, i === quasis.length - 1)
                  ),
                  quasi.expressions
                )
              );
            }
          }
        }
      });
      const output = generate.default(ast, {}, code);
      return {
        code: output.code,
        map: null
        // Source map generation can be added if necessary
      };
    }
  };
}

// electron.vite.config.ts
var electron_vite_config_default = defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve2("src/shared/src"),
        "@env": resolve2("./src/env.ts"),
        "@pkg": resolve2("./package.json")
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        "@env": resolve2("./src/env.ts"),
        "@pkg": resolve2("./package.json")
      }
    }
  },
  renderer: {
    ...viteRenderBaseConfig,
    build: {
      sourcemap: !!process.env.CI,
      target: "esnext"
    },
    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "true"
    }
  }
});
export {
  electron_vite_config_default as default
};
