import { useApi } from "context/api";
import { useFormik } from "formik";
import { IAchievement, IAchievementFromApi, IApiError } from "interfaces/api";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface UpdateAchievementProps {
  achievements: IAchievementFromApi[];
}

export const UpdateAchievement: React.FunctionComponent<UpdateAchievementProps> = ({
  achievements,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const achievement = achievements.filter(
    (achievement) => achievement.id === +id
  )[0];
  const { putAchievement } = useApi();
  const [error, setError] = useState<IApiError | null>();
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
      console.log(data);

      putAchievement(achievement.id, data).then(({ achievement, error }) => {
        if (error) setError(error);
        else history.push("/admin/achievements");
      });
    },
  });

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
