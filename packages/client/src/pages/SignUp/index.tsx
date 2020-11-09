import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "context/auth";
import { useApi } from "context/api";
import { usePopup } from "context/popup";

export interface SignUpFormValues {
  login: string;
  password: string;
  passwordConfirmation: string;
}

export const SignUp = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { setToken } = useAuth();
  const { register } = useApi();
  const { showPopup } = usePopup();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      passwordConfirmation: "",
    } as SignUpFormValues,
    validationSchema: Yup.object({
      login: Yup.string()
        .min(5, "Must be at least 5 characters")
        .required("Required"),
      password: Yup.string()
        .min(5, "Must be at least 5 characters")
        .required("Required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (data) => {
      register(data).then((response) => {
        if (response.error) setServerError(response.error.msg);
        else {
          setToken(response.token as string);
          history.push("/profile");
          showPopup({ msg: "You are welcome!", type: "neutral" });
        }
      });
    },
  });
  const isSubmitBtnActive =
    !!formik.touched.login &&
    !formik.errors.login &&
    !formik.errors.password &&
    !formik.errors.passwordConfirmation;
  return (
    <div className={styles.formContainer}>
      <div className={styles.formContent}>
        <h2 className={styles.header}>Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="text"
            name="login"
            placeholder="Your login"
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
            id="password"
            placeholder="Your password"
            className={`${styles.input} ${styles.passwordInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {!!formik.touched.password && !!formik.errors.password && (
            <p className={styles.errorMsg}>{formik.errors.password}</p>
          )}
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            placeholder="Confirm your password"
            className={`${styles.input} ${styles.passwordConfirmationInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passwordConfirmation}
          />
          {!!formik.touched.passwordConfirmation &&
            !!formik.errors.passwordConfirmation && (
              <p className={styles.errorMsg}>
                {formik.errors.passwordConfirmation}
              </p>
            )}
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton} ${
              isSubmitBtnActive && styles.active
            }`}
          >
            Continue
          </button>
          {!!serverError && <p className={styles.errorMsg}>{serverError}</p>}
        </form>
        <div className={styles.links}>
          <Link className={styles.link} to={"/login"}>
            Have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
