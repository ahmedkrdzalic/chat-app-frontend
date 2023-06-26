import React, { useContext, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../contexts/LoginContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .min(5, "Too Short!")
    .max(50, "Too Long!"),
  password: Yup.string()
    .min(8, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
});

export const Login = () => {
  let navigate = useNavigate();
  const { user, setUser } = useContext(LoginContext);

  const Login_Submit = async (data) => {
    let link = process.env.REACT_APP_BACKEND_URL + "/sign/login";
    await axios
      .post(link, data, {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          let cookieValue = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          );
          localStorage.setItem("token", cookieValue);
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.error);
      });
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="form-container">
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={Login_Submit}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <Field
              name="email"
              type="email"
              className="field"
              placeholder="email"
            />
            {errors.email && touched.email ? (
              <div className="field-error">{errors.email}</div>
            ) : null}
            <Field
              name="password"
              type="password"
              className="field"
              placeholder="password"
            />
            {errors.password && touched.password ? (
              <div className="field-error">{errors.password}</div>
            ) : null}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
