import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Logo } from "~/components";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { auth, sessionStorage } from "~/lib/auth.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  await auth.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    context,
  });
};

type LoaderError = { message: string } | null;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await auth.isAuthenticated(request, { successRedirect: "/" });
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(auth.sessionErrorKey) as LoaderError;
  return json({ error });
};

export default function Screen() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <Form
      method="post"
      className="flex flex-col w-80 m-[5rem_auto] border-[1px] p-6 shadow-md rounded-md"
    >
      <header className="flex flex-col items-center mt-4">
        <Link to="/">
          <Logo className="w-24" />
        </Link>
        <h2 className="text-lg m-4 uppercase">Login</h2>
      </header>

      <fieldset className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
        />
      </fieldset>

      <fieldset className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter the password"
        />
      </fieldset>
      {error ? (
        <p className="text-red-700">{error.message}</p>
      ) : (
        <p>Please provide your credentials</p>
      )}
      <Button variant="default" className="mt-6 uppercase">
        Log In
      </Button>
    </Form>
  );
}
