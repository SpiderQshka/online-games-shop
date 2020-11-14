import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGameCreator } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { toBase64 } from "utils/helpers";

interface CreateGameCreatorProps {
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const CreateGameCreator: React.FunctionComponent<CreateGameCreatorProps> = ({
  setUpdateTrigger,
  updateTrigger,
}) => {
  const history = useHistory();
  const { postGameCreator } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      logo: null,
      name: "",
      yearOfFoundation: new Date().getFullYear(),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      logo: Yup.mixed().required("Required"),
      yearOfFoundation: Yup.number().min(1900).required("Required"),
    }),
    onSubmit: (data) => {
      const logo = (formik.values.logo as any) as File;
      toBase64(logo).then((logo) => {
        setBaseImage(logo);
        postGameCreator({ ...data, logo }).then(({ gameCreator, error }) => {
          if (error) setError(error);
          else {
            setUpdateTrigger(!updateTrigger);
            history.push("/admin/gameCreators");
          }
        });
      });
    },
  });

  useEffect(() => {
    const processAsync = async () => {
      if (formik.values.logo) {
        const baseString = await toBase64(formik.values.logo as any);
        setBaseImage(baseString);
      }
    };
    processAsync();
  }, [formik.values.logo]);

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
        <img
          src={baseImage || "#"}
          alt="Game creator logo"
          height="200px"
          className={`${styles.previewImage} ${baseImage || styles.hidden}`}
        />
        <label className={styles.label}>
          <span className={styles.labelText}>Year of foundation</span>
          <input
            name="yearOfFoundation"
            type="number"
            min={1900}
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
        <div className={styles.actionsBlock}>
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
          >
            Create
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
