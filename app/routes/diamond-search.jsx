import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { liquid } = await authenticate.public.appProxy(request);
  // const apiKeyValue = await db.aPIKey.findFirst({orderBy: { id: "desc" }});
  const diamondSearch = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				<div id="diamondinstantinventory" style="height:1200px" data-apikey="8ec95570abe6411290197cb28845a6ff" height="100%" width="100%"></div>
					<script src="https://instantinventory-widgets-cl59s.s3.amazonaws.com/diamonds/1.0.0/widget.js"></script>`
  
  return liquid(diamondSearch);
}