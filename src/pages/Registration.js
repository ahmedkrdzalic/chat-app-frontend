import React, { useContext, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../contexts/LoginContext";

const RegistrationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  surname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
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

export const Registration = () => {
  let navigate = useNavigate();
  const { user } = useContext(LoginContext);

  const Registration_Submit = async (data) => {
    await axios
      .post(process.env.REACT_APP_BACKEND_URL + "/sign/registration", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/login");
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
  }, []);

  return (
    <div className="form-container">
      <h1>Registration</h1>
      <Formik
        initialValues={{
          name: "",
          surname: "",
          email: "",
          password: "",
        }}
        validationSchema={RegistrationSchema}
        onSubmit={Registration_Submit}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <Field name="name" className="field" placeholder="name" />
            {errors.firstName && touched.firstName ? (
              <div className="field-error">{errors.firstName}</div>
            ) : null}
            <Field name="surname" className="field" placeholder="surname" />
            {errors.lastName && touched.lastName ? (
              <div className="field-error">{errors.lastName}</div>
            ) : null}
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
