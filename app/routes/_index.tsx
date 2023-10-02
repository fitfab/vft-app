// NOTE: This is the index route the "root route"
import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { Logo } from "~/components";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const PAGE_QUERY = gql`
  query page($slug: String) {
    page(where: { slug: $slug }) {
      title
      slug
      services {
        title
        caption
        callToAction {
          ctaCopy
          ctaUrl
        }
      }
    }
  }
`;

export const meta: MetaFunction = () => {
  return [{ title: "Visual Flight Technology" }];
};

type Service = {
  title: string;
  caption: string;
  callToAction: {
    ctaCopy: string;
    ctaUrl: string;
  };
};
type Services = Service[];

type Page = {
  title: string;
  slug: string;
  services: Services;
};

type Response = { page: Page };

export const loader = async () => {
  const endPoint =
    "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clj1ad01r1cbl01uq5i4m0c2p/master";

  const graphQLClient = new GraphQLClient(endPoint, { fetch: fetch });
  const variables = { slug: "visual-flight-technology" };

  const response = await graphQLClient.request(PAGE_QUERY, variables);
  return response;
};

export default function Index() {
  const { page } = useLoaderData<Response>();
  const serviceEl = useRef<HTMLDivElement | null>(null);
  const contactEl = useRef<HTMLDivElement | null>(null);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const toggleNav = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.dataset.toggle);
    setMobileNavActive(!mobileNavActive);
  };
  const handleScroll = (event: React.MouseEvent<HTMLButtonElement>) => {
    const action = event.currentTarget.textContent?.toLowerCase();
    // 👇 Scroll to the section
    if (action === "services") {
      serviceEl.current?.scrollIntoView();
    } else {
      contactEl.current?.scrollIntoView();
    }
  };
  console.log("about to render");
  return (
    // md:backdrop-blur-sm md:bg-slate-300/15
    <main>
      <header className="fixed top-0 left-0 right-0  z-50">
        <div className="relative flex justify-between items-center md:container md:mx-auto p-4">
          <div className="w-24 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/25 from-0% to-transparent to-70%">
            <Logo />
          </div>
          <button
            className="fixed z-[9999] right-8 top-8"
            aria-controls="primary-navigation"
            data-toggle="open"
            onClick={toggleNav}
          >
            <span className="sr-only">menu</span>
            {mobileNavActive ? (
              <X className="md:hidden" stroke="white" size={32} />
            ) : (
              <Menu className="md:hidden" stroke="white" size={32} />
            )}
          </button>
          <nav
            id="primary-navigation"
            className="fixed inset-[0_0_0_32vw] bg-brand/50 backdrop-blur-md flex flex-col gap-4 pt-20 px-8 md:static md:flex-row md:pt-0 md:px-[1px] md:gap-[1px]"
          >
            <button
              onClick={handleScroll}
              className="block py-2 px-4 uppercase text-clamp-base cursor-pointer text-left text-white bg-white/20"
            >
              Services
            </button>
            <button
              onClick={handleScroll}
              className="block py-2 px-4 uppercase text-clamp-base cursor-pointer text-left text-white bg-white/20"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>
      <video
        className="w-[100vw]"
        muted
        loop
        autoPlay
        poster="https://res.cloudinary.com/dcvxv60gw/image/upload/q_auto,f_auto/v1687119087/fitfab/pool-house_yjb8hs"
      >
        <source src="https://res.cloudinary.com/dcvxv60gw/video/upload/q_auto,f_auto/v1686666056/fitfab/neil_landino_ojaxke" />
      </video>
      <section className="md:container md:mx-auto px-4 pt-8 pb-10">
        <div ref={serviceEl}>
          <h2 className="scroll-m-20 pb-2 text-clamp-xl font-semibold tracking-tight transition-colors first:mt-0">
            Serivices
          </h2>
          <div className="grid grid-cols-1 gap-4  md:grid-cols-3">
            {page.services.map(({ title, caption, callToAction }, index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>

                  <CardContent>{caption}</CardContent>
                  {/* <CardFooter>
                    <Link to={callToAction.ctaUrl}>{callToAction.ctaCopy}</Link>
                  </CardFooter> */}
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className=" bg-brand text-white">
        <div
          className="md:container md:mx-auto px-4 pt-8 pb-10"
          ref={contactEl}
        >
          <h2 className="scroll-m-20 pb-2 text-clamp-xl font-semibold tracking-tight transition-colors first:mt-0">
            Contact Us
          </h2>
          <p className="text-clamp-base mb-6 w-[75%]">
            I take the art of filmmaking to new heights with cutting-edge drone
            technology. I value your engagement and am eager to assist you in
            realizing your creative vision.
          </p>
          <p className="text-clamp-base mb-6">
            Various ways to connect with me:
          </p>
          <p className="text-clamp-base">Andrew Pollino</p>
          <p className="text-clamp-base">
            <strong>Email</strong>: pollino146@gmail.com
          </p>
          <p className="text-clamp-base">
            <strong>Phone</strong>: 203-957-2779
          </p>
        </div>
      </section>
    </main>
  );
}
