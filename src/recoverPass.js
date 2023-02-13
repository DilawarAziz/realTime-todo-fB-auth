import { useFormik } from "formik";
import { useState } from "react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { LoginFormValidation } from "./validation";
import { useHistory } from "react-router-dom";
function RecoverPass() {
  let history = useHistory();
  const auth = getAuth();
  const [bol, setbol] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    // validationSchema: LoginFormValidation,

    onSubmit: (values, event) => {
      const { email } = values;

      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("email send");
          setbol(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
  });
  console.log(formik);
  return (
    <div className="SignUp-main">
      <div className="SignUp-sub-main">
        <h1>Recover Password</h1>
        <p>Enter in the email accociated with your account</p>

        {bol?<h2>
          Good job. An email containing information on how to reset your
          password was send to <i>{formik?.values?.email}</i> please follow the
          instruction to reset your email. Thanks!
        </h2>:
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

          <button onSubmit={formik.handleSubmit} type="submit">
            Submit Reset &#x2192;
          </button>
        </form>}
        <a
          onClick={() => {
            history.push("/login");
          }}
        >
          {" "}
          &#x2192;Go back to login page{" "}
        </a>
      </div>
    </div>
  );
}
export default RecoverPass;
