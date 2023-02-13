import { useState } from "react";
import { useFormik } from "formik";
import app from "./firebase";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { Bars } from "react-loader-spinner";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineGoogle } from "react-icons/ai";
import { SignUpFormValidation } from "./validation";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
function SignUp({ googleLogin, fbLogin, useruid }) {
  const [spiner, setspiner] = useState(false);
  const [errorMsg, seterrorMsg] = useState(false);
  const db = getDatabase(app);
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
      name: "",
      password: "",
      Rpassword: "",
      email: "",
    },
    validationSchema: SignUpFormValidation,

    onSubmit: (values) => {
      let { email, name, password } = values;
      const auth = getAuth();
      setspiner(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          let b = userCredential.user.uid;
          handleClick();

          set(ref(db, "users/" + b + "/userdata"), {
            name,
            email,
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          setspiner(false);
          seterrorMsg(errorMessage);
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
            {useruid ? "Successfully Reigisterd!" : errorMsg}
          </Alert>
        </Snackbar>
      </Stack>
      <div className="SignUp-sub-main">
        <h1>Sign Up</h1>
        <p>
          Create a new regular user account or you can login with facebook and
          google
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
            {...formik.getFieldProps("name")}
            maxLength={"40"}
            placeholder="Full Name*"
            name="name"
            onChange={formik.handleChange("name")}
            value={formik.values.name}
            type="text"
          />
          <p className="errormsg">
            {formik.errors.name && formik.touched.name && formik.errors.name}
          </p>
          <input
            maxLength={"40"}
            {...formik.getFieldProps("email")}
            placeholder="Email Address*"
            name="email"
            onChange={formik.handleChange("email")}
            value={formik.values.email}
            type="email"
          />
          <p>
            {formik.errors.email && formik.touched.email && formik.errors.email}
          </p>
          <input
            {...formik.getFieldProps("password")}
            maxLength={"40"}
            placeholder="Password*"
            name="password"
            onChange={formik.handleChange("password")}
            value={formik.values.password}
            type="password"
          />
          <p className="errormsg">
            {formik.errors.password &&
              formik.touched.password &&
              formik.errors.password}
          </p>
          <input
            placeholder="repeat password*"
            type="text"
            {...formik.getFieldProps("Rpassword")}
            maxLength={"40"}
            name="password"
            onChange={formik.handleChange("Rpassword")}
            value={formik.values.Rpassword}
          />
          <p className="errormsg">
            {formik.errors.Rpassword &&
              formik.touched.Rpassword &&
              formik.errors.Rpassword}
          </p>

          <button
            disabled={spiner ? true : false}
            onSubmit={formik.handleSubmit}
            type="submit"
          >
            {spiner ? <Bars color="white" height={20} width={50} /> : "Sign Up"}
          </button>
        </form>
        <p>
          already have an account?{" "}
          <a
            onClick={() => {
              history.push("/login");
            }}
          >
            {" "}
            Sign In{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
export default SignUp;
