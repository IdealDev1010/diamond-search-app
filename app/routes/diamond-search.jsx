import { authenticate } from "../shopify.server";
import db from "../db.server"; 

export async function loader({ request }) {

  const { liquid } = await authenticate.public.appProxy(request);
  const apiKeyValue = await db.aPIKey.findFirst({orderBy: { id: "desc" }});
  const keyTextValue = apiKeyValue.keyText;
  const diamondSearch = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				<div id="diamondinstantinventory" style="height:1200px" data-apikey="${keyTextValue}" height="100%" width="100%"></div>
	 				<script src="https://instantinventory-widgets-cl59s.s3.amazonaws.com/diamonds/1.0.0/widget.js"></script>
          </script>
          <script>
					(function(d, w) {
						function observeAddToCart() {
							window.addEventListener("ds.addtocart", function(event) {
								jQuery("#diamondinstantinventory").addClass("ds-loading");
                const shopDomain = window.location.href;
                const postUrl = shopDomain + "/create-product";
								jQuery.ajax({
								  url: postUrl,
									type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify(event.detail.diamond)
								}).done(function(res) {
									var rurl = res.url;
									var variant = res.id;
									jQuery("#diamondinstantinventory").removeClass("ds-loading");
									setTimeout(() => {
										jQuery.ajax({
											url: "/cart/add.js",
											type: "POST",
											data: { 'items': [{'quantity': 1, 'id': variant}] }
										}).done(function(res) {
											jQuery("#diamondinstantinventory").removeClass("ds-loading");
											w.location = rurl;
										}).fail(function(res) {
											jQuery("#diamondinstantinventory").removeClass("ds-loading");
											// w.location = rurl;
											alert("test 1");
										});
										//w.location = rurl;
									}, 1000);
								}).fail(function(res) {
									jQuery("#diamondinstantinventory").removeClass("ds-loading");
									alert("test 2");
								});
							});
						}
						if (d.addEventListener) {
							d.addEventListener("ds.ready", function() {
								observeAddToCart();
							}, false);
						} else if (d.attachEvent) {
							d.documentElement.attachEvent("onpropertychange", function(event) {
								if (event.propertyName === "ds.ready")
									observeAddToCart();
							});
						}
					}(document, window));
					</script>
          `
 return liquid(diamondSearch);
}

// export const action = async ({ request }) => {
//   const data = await request.json();
//   console.log("JSON Data Received:", data);

//   return { success: true, data: data };
// }