import { json, redirect } from "@remix-run/node";  
import { authenticate } from "../shopify.server";  
import db from "../db.server";  

export const loader = async ({ request, params }) => {  
  await authenticate.admin(request);  

  const apiKeyId = Number(params.id); // Ensure the variable name is consistent  
  if (isNaN(apiKeyId)) {  
    throw new Response("Invalid ID", { status: 400 }); // Return a proper response object  
  }  

  const apiKey = await db.aPIKey.findUnique({  
    where: { id: apiKeyId },  
  });  

  if (!apiKey) {  
    throw new Response("API Key not found", { status: 404 }); // Include status codes  
  }  

  return json(apiKey); // Return the existing API key data  
}  

export const action = async ({ request, params }) => {  
  const { admin } = await authenticate.admin(request);  
  const formData = new URLSearchParams(await request.text());  
  const keyText = formData.get('keyText');  

  if (params.id === "new") {  
    // Handle creation of a new key  
    await db.aPIKey.create({  
      data: {  
        key: keyText, // Make sure this matches your database schema  
      },  
    });  
    return redirect('/success'); // Redirect after saving  
  } else {  
    const apiKeyId = Number(params.id);  
    
    if (isNaN(apiKeyId)) {  
      throw new Response("Invalid ID", { status: 400 }); // Return structured error response  
    }  

    // Update existing API key  
    await db.aPIKey.update({  
      where: { id: apiKeyId },  
      data: {  
        key: keyText, // Keep the field consistent with your database schema  
      },  
    });  
    return redirect('/success'); // Redirect after updating  
  }  
};  

// Default export for rendering the form or page  
export default function ApiKeyPage({ apiKey }) {  
  return (  
    <div>  
      <h1>{apiKey ? "Edit API Key" : "Create New API Key"}</h1>  
      {/* Form for creating or editing the key should go here */}  
      <form method="post">  
        <label>  
          API Key:  
          <input type="text" name="keyText" defaultValue={apiKey?.key} required />  
        </label>  
        <button type="submit">Save</button>  
      </form>  
    </div>  
  );  
}  