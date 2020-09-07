import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    } as SignUpFormValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email adress").required("Required"),
      password: Yup.string()
        .min(5, "Must be at least 5 characters")
        .required("Required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className={styles.formContainer}>
      <div className={styles.formContent}>
        <h2 className={styles.header}>Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className={`${styles.input} ${styles.nameInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {!!formik.touched.name && !!formik.errors.name && (
            <p className={styles.errorMsg}>{formik.errors.name}</p>
          )}
          <input
            type="text"
            name="email"
            placeholder="Your email"
            className={`${styles.input} ${styles.emailInput}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {!!formik.touched.email && !!formik.errors.email && (
            <p className={styles.errorMsg}>{formik.errors.email}</p>
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
            className={`${styles.button} ${styles.submitButton}`}
          >
            Continue
          </button>
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
