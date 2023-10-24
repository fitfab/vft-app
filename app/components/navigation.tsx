import { Form, NavLink } from "@remix-run/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "~/lib/utils";

type route = {
  cta: string;
  url?: string;
};

export interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  routes: Array<route>;
  auth?: string | undefined;
}

const Navigation = ({ scrollAction, routes, auth }: NavigationProps) => {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const toggleNav = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileNavActive(!mobileNavActive);
  };

  interface RouteViewProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    mobile?: boolean;
  }

  const AuthLink = ({
    auth,
    className,
  }: {
    auth: string | undefined;
    className?: string;
  }) => {
    if (auth) {
      return (
        <Form method="post" className={cn("flex", className)}>
          <button className="w-full py-2 px-4 uppercase text-clamp-base cursor-pointer text-left bg-white/70 rounded-md z-[1000]">
            Log Out
          </button>
        </Form>
      );
    }
    return (
      <NavLink
        to="/login"
        className={cn(
          "leading-10 py-2 px-4 uppercase text-clamp-base cursor-pointer text-left bg-white/70 rounded-md z-[1000]",
          className
        )}
      >
        login
      </NavLink>
    );
  };
  const RouteView = ({ className, mobile, ...props }: RouteViewProps) => {
    return routes.map((route, index) => (
      <button
        className={cn(
          "py-2 px-4 uppercase text-clamp-base cursor-pointer text-left bg-white/70 rounded-md z-[1000]",
          className
        )}
        onClick={(event) => {
          scrollAction(event);
          if (event.currentTarget.dataset.mobile) {
            toggleNav(event);
          }
        }}
        key={index}
        data-mobile={mobile ? "mobile" : "desktop"}
        {...props}
      >
        {route.cta}
      </button>
    ));
  };

  return (
    <nav className="flex gap-4">
      <button
        className="fixed z-[9999] right-8 top-6"
        aria-controls="primary-navigation"
        onClick={toggleNav}
      >
        <span className="sr-only">menu</span>
        {mobileNavActive ? (
          <X className="md:hidden" stroke="white" size={32} />
        ) : (
          <Menu className="md:hidden stroke-brand" size={32} />
        )}
      </button>
      <RouteView className="hidden md:block" />
      <AuthLink auth={auth} className="hidden md:flex" />
      <section
        className={`fixed inset-[0_0_0_32vw] bg-brand/50 backdrop-blur-sm flex flex-col gap-4 pt-28 px-8 md:hidden md:flex-row md:pt-0 md:px-[1px] md:bg-transparent md:backdrop-blur-none ${
          mobileNavActive ? "translate-x-[0vw]" : "translate-x-[78vw]"
        } transition-all`}
        id="primary-navigation"
      >
        <RouteView mobile={true} />
        <AuthLink auth={auth} />
      </section>
    </nav>
  );
};
Navigation.displayName = "Navigation";

export { Navigation };
