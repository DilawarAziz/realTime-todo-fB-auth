import { useFormik } from "formik";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LoginFormValidation } from "./validation";
import { useHistory } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineGoogle } from "react-icons/ai";
import { Bars } from "react-loader-spinner";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function Login({ googleLogin, fbLogin, useruid }) {
  const [spiner, setspiner] = useState(false);
  let history = useHistory();
  const [open, setOpen] = React.useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginFormValidation,

    onSubmit: (values, event) => {
      const { email, password } = values;
      const auth = getAuth();
      setspiner(true);

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          handleClick();
        })
        .catch((error) => {
          const errorMessage = error.message;
          setspiner(false);
          handleClick();
        });
    },
  });
  return (
    <div className="SignUp-main">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={useruid ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {useruid ? "Successfully Sign in!" : "Incorrect Email or password!"}
          </Alert>
        </Snackbar>
      </Stack>
      <div className="SignUp-sub-main">
        <h1>Sign In</h1>
        <p>
          welcome back, please login to your account or login with facebook and
          google or your regular account
        </p>
        <div className="login-with-main">
          <button onClick={fbLogin}>
            <FaFacebookF />
            facebook
          </button>
          <button
            style={{ backgroundColor: "#0096ffb5" }}
            onClick={googleLogin}
          >
            <AiOutlineGoogle />
            google
          </button>
        </div>
        <p>----------------------- or ----------------------</p>
        <form onSubmit={formik.handleSubmit} className="Sign-input-main">
          <input
            placeholder="email Address"
            {...formik.getFieldProps("email")}
            value={formik.values.email}
            onChange={formik.handleChange("email")}
            name="email"
            type="email"
            maxLength={"40"}
          />
          <p className="errormsg">
            {formik.errors.email && formik.touched.email
              ? formik.errors.email
              : ""}
          </p>
          <input
            placeholder="Enter your password"
            name="password"
            type="password"
            maxLength={"40"}
            {...formik.getFieldProps("password")}
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange("password")}
          />
          <p className="errormsg">
            {formik.errors.password && formik.touched.password
              ? formik.errors.password
              : ""}
          </p>
          <button
            disabled={spiner ? true : false}
            onSubmit={formik.handleSubmit}
            type="submit"
          >
            {spiner ? (
              <Bars color="white" height={20} width={50} />
            ) : (
              " Sign In"
            )}
          </button>
        </form>
        <a
          onClick={() => {
            history.push("/recoverPass");
          }}
        >
          Forget password?
        </a>
        <p>
          Don't have an account?{" "}
          <a
            onClick={() => {
              history.push("/Signup");
            }}
          >
            {" "}
            Sign Up{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
export default Login;
