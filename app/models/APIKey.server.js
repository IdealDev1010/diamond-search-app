// import apikey from "apikey"; // Ensure this import is actually needed  
// import invariant from "tiny-invariant"; // Check if this is used; otherwise, consider removing it  
// import db from "../db.server";  

// // Function to retrieve an API key by its ID and supplement it with additional data from GraphQL  
// export async function getAPIKey(id, graphql) {  
//   // Fetch the API key from the database  
//   const apiKey = await db.aPIKey.findFirst({ where: { id } });  
//   if (!apiKey) {  
//     return null; // Return null if the API key is not found  
//   }  

//   // Supplement the API key with data from GraphQL  
//   const supplementedKey = await supplementAPIKey(apiKey.id, graphql);  
//   return supplementedKey; // Return the supplemented key object  
// }  

// // Function to supplement the API key with additional data from a GraphQL query  
// async function supplementAPIKey(apiKeyId, graphql) {  

//   if (response.apiKey) {  
//     return {  
//       id: apiKeyId,  
//       keyText response.apiKey.keyText, 
//       createdAt: new Date(), // You can include the createdAt field if needed  
//     };  
//   } else {  
//     throw new Error('API key not found in GraphQL response'); // Handle case where no key is returned  
//   }  
// }  

// // Function to validate QR code data  
// export function validateQRCode(data) {  
//   const errors = {};  

//   if (!data.key) {  
//     errors.key = "Key is required"; // Validate that the key is present  
//   }  

//   return Object.keys(errors).length ? errors : null; // Return errors or null if none  
// } 