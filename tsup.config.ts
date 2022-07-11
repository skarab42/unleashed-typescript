import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  outDir: "build",
  platform: "node",
  splitting: true,
  sourcemap: false,
  minify: true,
  clean: true,
  dts: true,
});
