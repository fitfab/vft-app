import { AdvancedVideo } from "@cloudinary/react";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import {
  Form,
  NavLink,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";
import { Logo } from "~/components";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth.server";
import { cld, validateForm } from "~/lib/utils";

import { Loader2 } from "lucide-react";
import { z } from "zod";

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
const VideoSchema = z.object({
  id: z.string(),
  videoId: z.string().min(1, { message: "This video ID is required" }),
  errors: z
    .object({
      videoId: z.string(),
    })
    .optional(),
});
type VideoProps = z.infer<typeof VideoSchema>;
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const headers = await request.headers;

  const { data, errors } = await validateForm({
    formData,
    schema: VideoSchema,
  });

  if (errors) {
    return json({ data, errors });
  }
  const graphQLClient = new GraphQLClient(context.HYGRAPH_ENDPOINT!, {
    headers: {
      authorization: `Bearer ${context.HYGRAPH_TOKEN}`,
    },
    fetch: fetch,
  });
  const variables = {
    id: data.id,
    videoId: data.videoId,
  };

  const response = await graphQLClient.request(HERO_MUTATION, variables);
  // const email = await auth.isAuthenticated(request);
  return response;
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
  id: string;
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
  const actionData = useActionData<VideoProps>();

  const navigation = useNavigation();

  return (
    <main>
      <header className="top-0 left-0 right-0  z-50">
        <div className="fixed top-0 right-0 left-0 flex justify-between md:container md:mx-auto md:relative p-4 bg-white/50">
          <div className="w-16 md:w-20">
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>
          <p className="p-4 underline decoration-brand decoration-2">
            {email ? email : "Need to login"}
          </p>
        </div>
      </header>

      <section className="flex gap-8 md:container md:mx-auto px-4 pt-8 pb-10">
        <div className="bg-slate-100 flex justify-center w-[50%] min-h-full rounded-md overflow-hidden">
          {navigation.state === "loading" ||
          navigation.state === "submitting" ? (
            <p className="flex justify-center items-center m-auto min-h-[366px]">
              <Loader2 className="animate-spin" size={96} />
            </p>
          ) : (
            <AdvancedVideo
              muted
              loop
              autoPlay
              cldVid={cld.video(page.heroes[0].videoId).quality("auto")}
            />
          )}
        </div>
        <Form
          method="post"
          className="flex flex-col w-[50%] min-h-full border-[1px] p-6 shadow-md rounded-md"
        >
          <h3 className="flex justify-between text-lg my-4 uppercase">
            <span className="tracking-wide">Update video</span>
            <a
              href="https://console.cloudinary.com/"
              target="_blank"
              className=" text-blue-700 text-xs my-1 normal-case"
            >
              Get videoID from Cloudinary
            </a>
          </h3>
          <input type="hidden" name="id" defaultValue={page.heroes[0].id} />
          <fieldset className="mb-4">
            <Label htmlFor="videoId">Video ID</Label>
            <Input
              type="text"
              name="videoId"
              id="videoId"
              placeholder="Enter video ID"
            />
            {actionData?.errors?.videoId ? (
              <span className="text-red-600 text-sm">
                {actionData?.errors?.videoId}
              </span>
            ) : (
              <span className="text-sm">required field</span>
            )}
          </fieldset>

          <Button
            variant="default"
            className="mt-6 uppercase"
            disabled={navigation.state === "submitting"}
          >
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
