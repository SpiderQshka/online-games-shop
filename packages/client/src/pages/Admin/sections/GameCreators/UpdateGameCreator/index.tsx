import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGameCreator, IGameCreatorFromApi } from "interfaces/api";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { toBase64 } from "utils/helpers";

interface UpdateGameCreatorProps {
  gameCreators: IGameCreatorFromApi[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const UpdateGameCreator: React.FunctionComponent<UpdateGameCreatorProps> = ({
  gameCreators,
  setUpdateTrigger,
  updateTrigger,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const gameCreator = gameCreators.filter(
    (gameCreator) => gameCreator.id === +id
  )[0];
  const { putGameCreator } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      logo: null,
      name: gameCreator.name,
      yearOfFoundation: gameCreator.yearOfFoundation,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      logo: Yup.mixed(),
      yearOfFoundation: Yup.number().min(1900).required("Required"),
    }),
    onSubmit: (data) => {
      const logo = data.logo;
      if (logo) {
        toBase64(logo).then((logo) =>
          putGameCreator(gameCreator.id, { ...data, logo }).then(
            ({ gameCreator, error }) => {
              if (error) setError(error);
              else {
                setUpdateTrigger(!updateTrigger);
                history.push("/admin/gameCreators");
              }
            }
          )
        );
      } else {
        putGameCreator(gameCreator.id, {
          name: data.name,
          yearOfFoundation: data.yearOfFoundation,
        }).then(({ gameCreator, error }) => {
          if (error) setError(error);
          else {
            setUpdateTrigger(!updateTrigger);
            history.push("/admin/gameCreators");
          }
        });
      }
    },
  });

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>
        Update game creator with id {gameCreator.id}
      </h2>
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
          <span className={styles.labelText}>Logo</span>
          <input
            name="logo"
            type="file"
            onChange={(event) => {
              const files = event.currentTarget.files as FileList;
              formik.setFieldValue("logo", files[0]);
            }}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.nameInput}`}
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
            min="1900"
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
          Update
        </button>
        {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
      </form>
    </div>
  );
};
