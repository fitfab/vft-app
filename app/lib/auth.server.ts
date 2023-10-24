import {
  AppLoadContext,
  createCookieSessionStorage,
} from "@remix-run/cloudflare";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret"], // This should be an env variable
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<string>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form, context }) => {
    const { ADMIN, ADMIN_PASSWORD, USER, USER_PASSWORD } =
      context as AppLoadContext;
    const email = form.get("email");
    const password = form.get("password");

    if (!email) throw new AuthorizationError("Email is required");
    if (!password) throw new AuthorizationError("Password is required");

    if (email !== ADMIN) {
      throw new AuthorizationError("Invalid credentials: email or password");
    }

    if (password !== ADMIN_PASSWORD) {
      throw new AuthorizationError("Invalid credentials!");
    }
    return email as string;
  })
);

//
