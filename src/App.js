import "./App.css";
import "./styl/styl.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "./SignUp";
import Todo from "./todo";
import Login from "./login";
import { getAuth,signInWithPopup,onAuthStateChanged,FacebookAuthProvider ,GoogleAuthProvider} from "firebase/auth";
import { useState, useEffect } from "react";
import RecoverPass from "./recoverPass";
import { Watch } from "react-loader-spinner";

function App() {
  const [useruid, setuseruid] = useState("");
  const [isRun, setIsRun] = useState(true);
  const [spiner, setspiner] = useState(true);

  const auth = getAuth();
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setspiner(false)
      setuseruid(user);
      if (user?.uid) {
        setIsRun(true);
      } else {
        setIsRun(false);
      }
    });
  }, []);
  let googleLogin = ()=>{
    const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  }
  let fbLogin =()=>{
    signInWithPopup(auth, fbProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
console.log(credential,accessToken)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
console.log(credential,email,error,errorMessage)
    // ...
  });
  }
  if (spiner) {
    return (
      <div className="spinerpt">
        {" "}
        <Watch className="main-loader"  color="#00BFFF" height={300} width={200} />
      </div>
    );
  }
  return (
    <div>
      <Router>
        <Switch>
          <Route
            path="/Signup"
            render={() => {
              return useruid ? (
                <Redirect to="/todos" />
              ) : (
                <SignUp fbLogin={fbLogin} googleLogin={googleLogin} useruid={useruid?.uid} />
              );
            }}
          ></Route>
          <Route
          exact
            path="/recoverPass"
            render={() => {
              return( <RecoverPass/>)
            }}
          ></Route>
          <Route
            exact
            path="/login"
            render={() => {
              return useruid ? <Redirect to="/todos" /> : <Login fbLogin={fbLogin} googleLogin={googleLogin} useruid={useruid?.uid}/>;
            }}
          ></Route>
          <Route
            exact
            path="/todos"
            render={() => {
              return !useruid && !isRun ? (
                <Redirect to="/login" />
              ) : (
                <Todo useruid={useruid} />
              );
            }}
          ></Route>
          <Route
            exact
            path="/"
            render={() => {
              return useruid ? (
                <Redirect to="/todos" />
              ) : (
                <Redirect to="/login" />
              );
            }}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
