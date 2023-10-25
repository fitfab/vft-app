import { AdvancedVideo } from "@cloudinary/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";
import { Logo } from "~/components";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth.server";
import { cld } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "EDIT: Visual Flight Technology" }];
};

const PAGE_QUERY = gql`
  query page($slug: String) {
    page(where: { slug: $slug }) {
      title
      slug
      heroes {
        id
        videoId
      }
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

/**
 * Mutation variable
   {
      "id": "clj1vcd411rjr0bldlf253cdj",
      "videoId": "pexels_videos_1739010_jxucbo"
    }
 */
const HERO_MUTATION = gql`
  mutation UpdateHero($id: ID, $videoId: String) {
    updateHero(where: { id: $id }, data: { videoId: $videoId }) {
      id
      videoId
    }
    publishHero(where: { id: $id }, to: PUBLISHED) {
      videoId
      id
    }
  }
`;

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Request", request);
  return null;
};

type Service = {
  title: string;
  caption: string;
  callToAction: {
    ctaCopy: string;
    ctaUrl: string;
  };
};

type Heroes = {
  videoId: string;
};
type Services = Service[];

type Page = {
  title: string;
  slug: string;
  heroes: Array<Heroes>;
  services: Services;
};

type Response = { page: Page; email?: string };

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const endPoint = context.HYGRAPH_ENDPOINT;

  const graphQLClient = new GraphQLClient(endPoint!, { fetch: fetch });
  const variables = { slug: "visual-flight-technology" };

  const response = (await graphQLClient.request(
    PAGE_QUERY,
    variables
  )) as Response;
  const email = await auth.isAuthenticated(request);

  return { email, page: response.page };
};

export default function Index() {
  const { email, page } = useLoaderData<Response>();

  return (
    <main>
      <header className="top-0 left-0 right-0  z-50">
        <div className="fixed top-0 right-0 left-0 flex justify-between md:container md:mx-auto md:relative p-4 bg-white/50">
          <div className="w-16 md:w-20">
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>
        </div>
      </header>

      <section className="flex gap-8 md:container md:mx-auto px-4 pt-8 pb-10">
        <div>
          <h2 className="scroll-m-20 pb-2 text-clamp-xl font-semibold tracking-tight transition-colors first:mt-0">
            Hero Video
          </h2>
          <AdvancedVideo
            className="relative -z-[1]"
            muted
            loop
            autoPlay
            cldVid={cld.video(page.heroes[0].videoId).quality("auto")}
          />
        </div>
        <Form
          method="post"
          className="flex flex-col w-full h-full m-[5rem_auto] border-[1px] p-6 shadow-md rounded-md"
        >
          <h3 className="flex justify-between text-lg my-4 uppercase">
            <span>Update video</span>
            <a
              href="https://console.cloudinary.com/"
              target="_blank"
              className=" text-blue-700 text-xs my-1 normal-case"
            >
              Get videoID from Cloudinary
            </a>
          </h3>
          <fieldset className="mb-4">
            <Label htmlFor="videoId">Video ID</Label>
            <Input
              type="text"
              name="videoID"
              id="videoId"
              placeholder="Enter video ID"
            />
          </fieldset>

          <Button variant="default" className="mt-6 uppercase">
            update & publish
          </Button>
        </Form>
      </section>

      <section className="md:container md:mx-auto px-4 pt-8 pb-10">
        <div>
          <h2 className="scroll-m-20 pb-2 text-clamp-xl font-semibold tracking-tight transition-colors first:mt-0">
            Services
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
    </main>
  );
}
