import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

/**
 * NOTE: extending remix context type
 * ref: // ref: https://tom-sherman.com/blog/type-safe-remix-cloudflare-loader-context
 *
 * This types the context in Remix on Cloudflare Pages
 * I want to keep USER and ADMIN credentials in ".dev.vars" for this
 * small project.
 */

interface Env {
  CLOUDINARY_CLOUDNAME?: string;
  HYGRAPH_ENDPOINT?: string;
  HYGRAPH_TOKEN?: string;
  ADMIN?: string;
  ADMIN_PASSWORD?: string;
}

type Context = EventContext<Env, string, unknown>;

declare module "@remix-run/server-runtime" {
  interface AppLoadContext extends Env {}
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context: Context) => ({
    CLOUDINARY_CLOUDNAME: context.env.CLOUDINARY_CLOUDNAME,
    HYGRAPH_ENDPOINT: context.env.HYGRAPH_ENDPOINT,
    HYGRAPH_TOKEN: context.env.HYGRAPH_TOKEN,
    ADMIN: context.env.ADMIN,
    ADMIN_PASSWORD: context.env.ADMIN_PASSWORD,
  }),
  mode: build.mode,
});
