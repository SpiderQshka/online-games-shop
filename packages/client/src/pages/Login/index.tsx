import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { config } from "config";

interface LoginFormValues {
  login: string;
  password: string;
}

export const Login = () => {
  const formik = useFormik({
    initialValues: { login: "", password: "" } as LoginFormValues,
    validationSchema: Yup.object({
      login: Yup.string()
        .min(5, "Must be at least 5 characters")
        .required("Required"),
      password: Yup.string()
        .min(5, "Must be at least 5 characters")
        .required("Required"),
    }),
    onSubmit: (data) => {
      console.log(data);
      axios.post(`${config.apiUrl}/login`, data).then(
        (result) => console.log(result),
        (error) => console.log(error)
      );
    },
  });
  return (
    <div className={styles.formContainer}>
      <div className={styles.formContent}>
        <h2 className={styles.header}>Log in</h2>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="text"
            name="login"
            placeholder="Login"
            className={`${styles.input} ${styles.loginInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.login}
          />
          {!!formik.touched.login && !!formik.errors.login && (
            <p className={styles.errorMsg}>{formik.errors.login}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`${styles.input} ${styles.passwordInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {!!formik.touched.password && !!formik.errors.password && (
            <p className={styles.errorMsg}>{formik.errors.password}</p>
          )}
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
          >
            Continue
          </button>
        </form>
        <div className={styles.links}>
          <Link className={styles.link} to={"#"}>
            Forget the password?
          </Link>
          <Link className={styles.link} to={"/signup"}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
