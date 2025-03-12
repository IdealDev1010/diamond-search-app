import { PrismaClient } from "@prisma/client";
import db from "../db.server";  

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
 

export const getPosts = () => db.aPIKey.findFirst();