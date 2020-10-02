import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGameCreator } from "interfaces/api";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface CreateGameCreatorProps {}

export const CreateGameCreator: React.FunctionComponent<CreateGameCreatorProps> = () => {
  const history = useHistory();
  const { postGameCreator } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      logo: "",
      name: "",
      yearOfFoundation: new Date().getFullYear(),
    } as IGameCreator,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      logo: Yup.string().required("Required"),
      yearOfFoundation: Yup.number().min(1960).required("Required"),
    }),
    onSubmit: (data) => {
      console.log(data);

      postGameCreator(data).then(({ gameCreator, error }) => {
        if (error) setError(error);
        else history.push("/admin/gameCreators");
      });
    },
  });

  console.log(formik.errors);

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Create game creator</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>Name</span>
          <input
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.nameInput}`}
            value={formik.values.name}
          />
        </label>
        {!!formik.touched.name && !!formik.errors.name && (
          <p className={styles.errorMsg}>{formik.errors.name}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Link to logo</span>
          <input
            name="logo"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.logoInput}`}
            value={formik.values.logo}
          />
        </label>
        {!!formik.touched.logo && !!formik.errors.logo && (
          <p className={styles.errorMsg}>{formik.errors.logo}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Year of foundation</span>
          <input
            name="yearOfFoundation"
            type="number"
            min="1960"
            max={new Date().getFullYear()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.yearOfFoundationInput}`}
            value={formik.values.yearOfFoundation}
          />
        </label>
        {!!formik.touched.yearOfFoundation &&
          !!formik.errors.yearOfFoundation && (
            <p className={styles.errorMsg}>{formik.errors.yearOfFoundation}</p>
          )}
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton} ${
            true && styles.active
          }`}
        >
          Create
        </button>
        {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
      </form>
    </div>
  );
};
