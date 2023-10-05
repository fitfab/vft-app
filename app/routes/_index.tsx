// NOTE: This is the index route the "root route"
import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";
import { useRef } from "react";
import { Logo, Navigation } from "~/components";
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
const navRoutes = [{ cta: "services" }, { cta: "contact" }];

export default function Index() {
  const { page } = useLoaderData<Response>();
  const serviceEl = useRef<HTMLDivElement | null>(null);
  const contactEl = useRef<HTMLDivElement | null>(null);

  const handleScroll = (event: React.MouseEvent<HTMLButtonElement>) => {
    const action = event.currentTarget.textContent?.toLowerCase();

    // 👇 Scroll to the section
    if (action === "services") {
      serviceEl.current?.scrollIntoView(false);
    } else {
      contactEl.current?.scrollIntoView(false);
    }
  };

  return (
    <main>
      <header className="top-0 left-0 right-0  z-50">
        <div className="fixed top-0 right-0 left-0 flex justify-between md:container md:mx-auto md:relative p-4 bg-white/50">
          <div className="w-16 md:w-20">
            <Logo />
          </div>
          <Navigation scrollAction={handleScroll} routes={navRoutes} />
        </div>
      </header>

      <video
        className="relative w-[100vw] -z-10 "
        muted
        loop
        autoPlay
        poster="https://res.cloudinary.com/dcvxv60gw/image/upload/q_auto,f_auto/v1687119087/fitfab/pool-house_yjb8hs"
      >
        <source src="https://res.cloudinary.com/dcvxv60gw/video/upload/q_auto/v1686666056/fitfab/neil_landino_ojaxke.webm" />
        <source src="https://res.cloudinary.com/dcvxv60gw/video/upload/q_auto/v1686666056/fitfab/neil_landino_ojaxke.mp4" />
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
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className=" bg-brand text-white min-h-[30vh]">
        <div
          className="md:container md:mx-auto px-4 pt-8 pb-10"
          ref={contactEl}
        >
          <h2 className="scroll-m-20 pb-2 text-clamp-xl font-semibold tracking-tight transition-colors first:mt-0">
            Contact Details
          </h2>
          <p className="text-clamp-base mb-6 w-[75%]">
            I take the art of filmmaking to new heights with cutting-edge drone
            technology. I value your engagement and am eager to assist you in
            realizing your creative vision.
          </p>
          <p className="text-clamp-base mb-6">
            Please reach out if you any question:
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
