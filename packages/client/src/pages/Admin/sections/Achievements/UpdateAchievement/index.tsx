import { useApi } from "context/api";
import { useFormik } from "formik";
import { IAchievement, IAchievementFromApi, IApiError } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { usePopup } from "context/popup";

interface UpdateAchievementProps {
  achievements: IAchievementFromApi[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
  error: IApiError | null;
}

export const UpdateAchievement: React.FunctionComponent<UpdateAchievementProps> = ({
  achievements,
  setUpdateTrigger,
  updateTrigger,
  error: propsError,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const achievement = achievements.filter(
    (achievement) => achievement.id === +id
  )[0];
  const { putAchievement } = useApi();

  const [error, setError] = useState<IApiError | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: achievement.name,
      discount: achievement.discount,
    } as IAchievement,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      discount: Yup.number().min(0).max(100).required("Required"),
    }),
    onSubmit: (data) => {
      setIsLoading(true);
      putAchievement(achievement.id, data).then(({ error }) => {
        if (error) setError(error);
        else {
          setUpdateTrigger(!updateTrigger);
          history.push("/admin/achievements");
        }
        setIsLoading(false);
      });
    },
  });

  useEffect(() => {
    if (propsError) history.push("/admin/achievements");
  }, [propsError]);

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>
        Update achievement with id {achievement.id}
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
          <span className={styles.labelText}>Discount</span>
          <input
            name="discount"
            type="number"
            min="0"
            max="100"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.discountInput}`}
            value={formik.values.discount}
          />
        </label>
        {!!formik.touched.discount && !!formik.errors.discount && (
          <p className={styles.errorMsg}>{formik.errors.discount}</p>
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
