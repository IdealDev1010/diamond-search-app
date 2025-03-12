import { authenticate } from "../shopify.server";  

export async function loader({ request }) {
  const { liquid } = await authenticate.public.appProxy(request);

  return liquid("Hello World");
}