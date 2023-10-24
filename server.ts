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
  ADMIN?: string;
  ADMIN_PASSWORD?: string;
  USER?: string;
  USER_PASSWORD?: string;
}

type Context = EventContext<Env, string, unknown>;

declare module "@remix-run/server-runtime" {
  interface AppLoadContext extends Env {}
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context: Context) => ({
    ADMIN: context.env.ADMIN,
    ADMIN_PASSWORD: context.env.ADMIN_PASSWORD,
    USER: context.env.USER,
    USER_PASSWORD: context.env.USER_PASSWORD,
  }),
  mode: build.mode,
});
