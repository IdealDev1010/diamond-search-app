import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request, res }) => {
  try {
    const { session } = await authenticate.public.appProxy(request);
    const data = await request.json();
    const shop = session.shop;
    // const accessToken = session.accessToken;
    const accessToken = process.env.ACCESS_TOKEN;

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
      const createProductMediaMutation = `
        mutation UpdateProductWithNewMedia($input: ProductInput!, $media: [CreateMediaInput!]) {
          productUpdate(input: $input, media: $media) {
            product {
              id
              media(first: 10) {
                nodes {
                  alt
                  mediaContentType
                  preview {
                    status
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const inputVariablesForProductMedia = {
        input: {
          id: result.data.productCreate.product.id
        },
        media: [
          {
            originalSource: `https://shopify.nanowebgroup.com/images/${data.shape.toLowerCase()}.jpg`,
            mediaContentType: "IMAGE"
          }
        ]
      }

      await fetch(graphqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: createProductMediaMutation,
          variables: inputVariablesForProductMedia,
        }),
      })

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

      const locationInfo = await locationInfoResponse.json();
      console.log("Location Info Response:", JSON.stringify(locationInfo, null, 2));

      if (locationInfo.errors) {
        console.error("GraphQL Errors:", locationInfo.errors);
      }

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
              price: data.price.totalPriceInUSD,
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

        const res = await responseForVariant.json();

        if (res) {
          const getPublicinfoGql = `
            query GetSalesChannels {
              publications(first: 1) {
                edges {
                  node {
                    id
                    catalog {
                      id
                      title
                    }
                  }
                }
              }
            }
          `;

          const responseForPublicInfo = await fetch(graphqlEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({
              query: getPublicinfoGql
            }),
          });

          if (responseForPublicInfo) {
            const publicationID = await responseForPublicInfo.json()

            const publishiblePublishMutationGql = `
              mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
                publishablePublish(id: $id, input: $input) {
                  publishable {
                    availablePublicationsCount {
                      count
                    }
                    resourcePublicationsCount {
                      count
                    }
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `;

            const publishInputParams = {
              id: result.data.productCreate.product.id,
              input: {
                publicationId: publicationID.data.publications.edges[0].node.id
              }
            }

            const responseForPublication = await fetch(graphqlEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
              },
              body: JSON.stringify({
                query: publishiblePublishMutationGql,
                variables: publishInputParams
              }),
            })

            const resultPublishedSales = await responseForPublication.json();

            if (resultPublishedSales) {
              const variantId = res?.data?.productVariantsBulkCreate?.productVariants?.[0]?.id.replace(/^.*\//, "");
              return  { id: variantId, url: '/checkout' };
            }
          }
        }
      }
    }
  } catch (error) {
    return { state: "false", error }
  }
};
