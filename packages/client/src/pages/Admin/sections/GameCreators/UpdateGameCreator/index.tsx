import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGameCreatorFromApi, IGameCreator } from "interfaces/api";
import React, { useEffect, useState } from "react";
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
  const [baseLogo, setBaseLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    onSubmit: async (data) => {
      setIsLoading(true);

      const logo = data.logo;

      const gameCreatorObj = {
        name: data.name,
        yearOfFoundation: data.yearOfFoundation,
      } as IGameCreator;

      if (logo) {
        const baseLogo = await toBase64(logo);
        gameCreatorObj.logo = baseLogo;
      }

      putGameCreator(gameCreator.id, gameCreatorObj).then(
        ({ gameCreator, error }) => {
          setIsLoading(false);
          if (error) setError(error);
          else {
            setUpdateTrigger(!updateTrigger);
            history.push("/admin/gameCreators");
          }
        }
      );
    },
  });

  useEffect(() => {
    const processAsync = async () => {
      if (formik.values.logo) {
        const baseString = await toBase64(formik.values.logo as any);
        setBaseLogo(baseString);
      }
    };
    processAsync();
  }, [formik.values.logo]);

  const currentLogo = gameCreator.logo;

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
        <img
          src={baseLogo || currentLogo || "#"}
          alt="Game creator logo"
          className={styles.previewImage}
        />
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
