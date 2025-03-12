import { useEffect, useState } from "react";  
import { useActionData, useLoaderData, Form } from "@remix-run/react";  
import { Page, TextField, Button, Toast } from "@shopify/polaris";   
import { authenticate } from "../shopify.server";  
import db from "../db.server";  

// export const loader = async ({ request }) => {  
//   await authenticate.admin(request); 
//   let apiKeys = await request.formData(); 
//   return null;  
// };  

export async function loader() {
  // await authenticate.admin(request); 
  // let apiKeys = await request.formData();
  // apiKeys = Object.fromEntries(apiKeys);
  // apiKeys ({
  //   data {
  //     keyText:"11"
  //   }
  // })
 
  return null;
}

export const action = async ({ request }) => { 
  const { admin } = await authenticate.admin(request);
  let apiKeys = await request.formData(); 
  apiKeys = Object.fromEntries(apiKeys);

  await db.aPIKey.create({ 
    data: {
      keyText: JSON.stringify(apiKeys.apiKey)
    },
  }
  )
  return JSON.stringify(apiKeys);   
};  

export default function Index() {  
  const [formState, setFormState] = useState ("");  
  return (  
    <Page title="Diamond Search Page">  
      <Form method="POST">
        <TextField  
          label="API Key"  
          name="apiKey"
          value={formState.apiKey}  
          onChange={(value) => setFormState({...formState, apiKey: value})}   
          required  
        /> 
        <Button submit={true}>Save </Button> 
      </Form>
    </Page>  
  );  
}  