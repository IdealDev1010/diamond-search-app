import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request, res }) => {
  try {
    const { session } = await authenticate.public.appProxy(request);
    const data = await request.json();
    const shop = session.shop;
    // const accessToken = session.accessToken;
    const accessToken = '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';

    const graphqlEndpoint = `https://${shop}/admin/api/2025-01/graphql.json`;

    const createProductMutation = `
      mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          options {
            id
            name
            position
          }
        }
          userErrors {
            field
            message
          }
      }
    }
    `;

    const title = `${data.carat}-CARAT ${data.shape.toUpperCase()} DIAMOND`;
    const descriptionHtml = 'Diamond Information<br/>';

    const productData = {
      input: {
        title,
        descriptionHtml,
        productType: "Diamond"
      }
    };

    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: createProductMutation,
        variables: productData,
      }),
    })
    
    const result = await response.json();

    if (result) {
      const getLocationInfoGql = `
        query getLocations {
          locations(first: 1) {
            edges {
              node {
                id
                name
                address {
                  address1
                  city
                  country
                }
              }
            }
          }
        }
      `;

      const locationInfoResponse = await fetch(graphqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: getLocationInfoGql
        })
      });

      // Convert response to JSON
      const locationInfo = await locationInfoResponse.json();
      console.log("Location Info Response:", JSON.stringify(locationInfo, null, 2)); // Debugging

      // Check for errors
      if (locationInfo.errors) {
        console.error("GraphQL Errors:", locationInfo.errors);
      }

      // Extract the location data
      const locations = locationInfo?.data?.locations?.edges || [];
      if (locations.length === 0) {
        console.error("No locations found. Check API permissions and store settings.");
      }

      if (locationInfo.data) {
        const createProductVariantMutation = `
          mutation ProductVariantsCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkCreate(productId: $productId, variants: $variants) {
            productVariants {
              id
              title
              selectedOptions {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
        `;

        const productVariantData = {
          productId: result.data.productCreate.product.id,
          variants: [
            {
              price: 176.00,
              barcode: `${data.id}`,
              optionValues: [
                {
                  name: "Diamond",
                  optionId: result.data.productCreate.product.options[0].id
                }
              ],
              inventoryQuantities: [
                {
                  locationId: locationInfo.data.locations.edges[0].node.id,
                  availableQuantity: 1
                }
              ]
            }
          ]
        };

        const responseForVariant = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
          body: JSON.stringify({
            query: createProductVariantMutation,
            variables: productVariantData,
          }),
        })

        if (responseForVariant) {
          return responseForVariant.json();
        }
      }
    }
  } catch (error) {
    return { state: "false", error }
  }
};
