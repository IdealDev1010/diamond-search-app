import { useEffect, useState } from "react";  
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";  
import { Page, TextField, Button, Text, InlineGrid } from "@shopify/polaris";   
import { authenticate } from "../shopify.server";  
import db from "../db.server";  

export const loader = async ({ request }) => {  
  // const apiKeyValue = await db.aPIKey.findFirst({orderBy: { id: "desc" }}); 
  // return { apiKeyValue };
  const url = new URL(request.url);
  const success = url.searchParams.get("success") === "true";
  return { success };

};  

export const action = async ({ request }) => { 
  const { admin } = await authenticate.admin(request);
  let apiKeys = await request.formData(); 
  apiKeys = Object.fromEntries(apiKeys);
  const apiKeyValue = apiKeys.apiKey;
 // const apiKeyString = apiKeyValue.replace(/"/g, '');
  await db.aPIKey.create({ 
    data: {
      keyText: JSON.stringify(apiKeyValue)
    },
  })
  return redirect('/app?success=true');   
};  

export default function Index() {  
  const { success } = useLoaderData();
  const [formState, setFormState] = useState ("");  
  return (  
    <Page title="Diamond Search Page">  
     {success && <Text color="green">Saved successfully!</Text>} {/* Conditionally display success message */}  
      <Form method="POST" className="grid gap-4">
      <InlineGrid gap="400" columns={['twoThirds', 'oneThird']}>
        <div label="twoThirds"><TextField  
          name="apiKey"
          value={formState.apiKey}  
          onChange={(value) => setFormState({...formState, apiKey: value})}   
          required  
        /> 
        </div>
        <Button label="oneThird" submit={true}>Save </Button>
        </InlineGrid>
      </Form>
    </Page>  
  );  
}  
