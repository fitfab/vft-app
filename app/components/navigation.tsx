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
}

const Navigation = ({ scrollAction, routes }: NavigationProps) => {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const toggleNav = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileNavActive(!mobileNavActive);
  };

  interface RouteViewProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    mobile?: boolean;
  }
  const RouteView = ({ className, mobile, ...props }: RouteViewProps) => {
    return routes.map((route, index) => (
      <button
        className={cn(
          "py-2 px-4 uppercase text-clamp-sm cursor-pointer text-left bg-white/70 rounded-md z-[1000]",
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
      <section
        className={`fixed inset-[0_0_0_32vw] bg-brand/50 backdrop-blur-sm flex flex-col gap-4 pt-28 px-8 md:hidden md:flex-row md:pt-0 md:px-[1px] md:bg-transparent md:backdrop-blur-none ${
          mobileNavActive ? "translate-x-[0vw]" : "translate-x-[78vw]"
        } transition-all`}
        id="primary-navigation"
      >
        <RouteView mobile={true} />
      </section>
    </nav>
  );
};
Navigation.displayName = "Navigation";

export { Navigation };
