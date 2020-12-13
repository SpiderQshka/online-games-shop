import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGenre, IGenreFromApi } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface UpdateGenreProps {
  genres: IGenreFromApi[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
  error: IApiError | null;
}

export const UpdateGenre: React.FunctionComponent<UpdateGenreProps> = ({
  genres,
  setUpdateTrigger,
  updateTrigger,
  error: propsError,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const genre = genres.filter((genre) => genre.id === +id)[0];
  if (!genre) history.goBack();
  const { putGenre } = useApi();

  const [error, setError] = useState<IApiError | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: genre.name,
    } as IGenre,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name should be at least 3 characters long")
        .required("Required"),
    }),
    onSubmit: (data) => {
      setIsLoading(true);
      putGenre(genre.id, data).then(({ genre, error }) => {
        setIsLoading(false);
        if (error) setError(error);
        else {
          setUpdateTrigger(!updateTrigger);
          history.push("/admin/genres");
        }
      });
    },
  });

  useEffect(() => {
    if (propsError) history.push("/admin/genres");
  }, [propsError]);

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Update genre with id {genre.id}</h2>
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
        <div
          className={`${styles.actionsBlock} ${isLoading && styles.loading}`}
        >
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
          >
            Update
          </button>
          <button
            type="reset"
            onClick={formik.handleReset}
            className={`${styles.button} ${styles.resetButton}`}
          >
            Reset
          </button>
        </div>
        {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
      </form>
    </div>
  );
};
