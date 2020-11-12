import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGenre } from "interfaces/api";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface CreateGenreProps {
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const CreateGenre: React.FunctionComponent<CreateGenreProps> = ({
  setUpdateTrigger,
  updateTrigger,
}) => {
  const history = useHistory();
  const { postGenre } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      name: "",
    } as IGenre,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name should be at least 3 characters long")
        .required("Required"),
    }),
    onSubmit: (data) =>
      postGenre(data).then(({ genre, error }) => {
        if (error) setError(error);
        else {
          setUpdateTrigger(!updateTrigger);
          history.push("/admin/genres");
        }
      }),
  });

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Create genre</h2>
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
