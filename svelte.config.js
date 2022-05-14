import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import { resolve } from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          $components: resolve("./src/components"),
          $lib: resolve("./src/lib"),
        },
      },
    },
    prerender: {
      default: true,
    },
  },
};

export default config;
