// NOTE: This is the index route the "root route"
import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";
import { useRef } from "react";
import { Card, Logo } from "~/components";

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
  console.log("response:", response);
  return response;
};

export default function Index() {
  const { page } = useLoaderData<Response>();
  const serviceEl = useRef<HTMLDivElement | null>(null);

  const handleServiceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault()
    // 👇 Scroll to the last element in the list
    serviceEl.current?.scrollIntoView();
  };
  return (
    <main>
      <header className="fixed top-0 left-0 right-0 backdrop-blur-sm bg-slate-600/20 border-b-[1px] border-slate-300/15">
        <div className="flex justify-between h-16 md:container md:mx-auto md:px-0 p-3">
          <Logo />
          <nav className="flex justify-center items-center gap-4  ">
            <button
              onClick={handleServiceClick}
              className="bg-white rounded-full block px-3 py-1 uppercase text-sm"
            >
              Services
            </button>
            <Link
              to="/About"
              className="bg-white rounded-full block px-3 py-1 uppercase text-sm"
            >
              About
            </Link>
            <Link
              to="/Contact"
              className="bg-white rounded-full block px-3 py-1 uppercase text-sm"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <video
        className="w-full"
        muted
        loop
        autoPlay
        poster="https://res.cloudinary.com/dcvxv60gw/image/upload/q_auto,f_auto/v1687119087/fitfab/pool-house_yjb8hs"
      >
        <source src="https://res.cloudinary.com/dcvxv60gw/video/upload/q_auto,f_auto/v1686666056/fitfab/neil_landino_ojaxke" />
      </video>
      <section className="u-container">
        <div className="block" ref={serviceEl}>
          <h2>Serivices</h2>
          <div className="columns">
            {page.services.map(({ title, caption, callToAction }, index) => {
              return (
                <Card
                  key={index}
                  title={title}
                  caption={caption}
                  ctaCopy={callToAction.ctaCopy}
                  ctaUrl={callToAction.ctaUrl}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
