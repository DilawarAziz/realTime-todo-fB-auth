import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
function Firebaseuiauth() {
  useEffect(() => {
    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    // console.log(ui)
    ui.start("#firebaseui-auth-container", {
        signInSuccessUrl: '<url-to-redirect-to-on-success>',
      signInOptions: [
          {
              provider:  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              scopes: [
                'https://www.googleapis.com/auth/contacts.readonly'
              ],
              customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
              }
            },
           
      ],
      tosUrl: "www.facebook.com",
      // Privacy policy url/callback.
      privacyPolicyUrl: "<your-privacy-policy-url>",
    });
  }, [])   
  return (
    <>
      <div className="SignUp-main">
        <div id={"firebaseui-auth-container"}></div>
      </div>
    </>
  );
}
export default Firebaseuiauth;
