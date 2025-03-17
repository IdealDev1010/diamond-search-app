import { authenticate } from "../shopify.server";
import db from "../db.server"; 
// import { useEffect } from "react";

export async function loader({ request }) {

  // useEffect(() => {
  //   function handleMessage(event) {
  //     if (event.data?.type === "diamondWidgetButtonClicked") {
  //       console.log("Iframe button clicked:", event.data);
  //       // your custom logic here
  //     }
  //   }

  //   window.addEventListener("message", handleMessage);

  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, []);

  const { liquid } = await authenticate.public.appProxy(request);
  const apiKeyValue = await db.aPIKey.findFirst({orderBy: { id: "desc" }});
  const keyTextValue = apiKeyValue.keyText;
  const diamondSearch = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				<div id="diamondinstantinventory" style="height:1200px" data-apikey="${keyTextValue}" height="100%" width="100%"></div>
	 				<script src="https://instantinventory-widgets-cl59s.s3.amazonaws.com/diamonds/1.0.0/widget.js"></script>
          </script>
          
          <script>
            setTimeout(() => {
              const iframe = document.getElementById('diamondRapnetIframe');
              console.log("Ifreame has been loaded==>", iframe);

                console.log("Ifreame has been loaded111==>", iframe);
                try {
                  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                  const handleButtonClick = () => {  
                    console.log('Button clicked inside iframe!');  
                  };

                  const observer = new MutationObserver((mutations) => {  
                    mutations.forEach(mutation => {  
                      if (mutation.type === 'childList') {  
                        const button = iframeDocument.getElementsByClassName('info__CartButton-sc-6wrchz-7')[0];
                        if (button) {  
                          button.addEventListener('click', handleButtonClick);  
                          // Optionally disconnect the observer after setting the event listener  
                          observer.disconnect();  
                        } 
                      }
                    }); 
                  });
                  observer.observe(iframeDocument.body, { childList: true, subtree: true });  
                } catch (e) {
                  console.log("Error==>", e);
                } finally {
                  console.log("Completed"); 
                }
            }, 5000);
          </script>
          `
 return liquid(diamondSearch);
}