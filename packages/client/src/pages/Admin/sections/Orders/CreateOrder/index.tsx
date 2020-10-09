import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IUser, OrderStatus } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface OrderFormValues {
  gamesIds: string[];
  status: OrderStatus;
  userId: number;
  physicalGamesCopiesIds: string[];
}

interface AddOrderProps {
  games: IGameForUI[];
  users: IUser[];
}

export const CreateOrder: React.FunctionComponent<AddOrderProps> = ({
  games,
  users,
}) => {
  const history = useHistory();
  const { postOrderAdmin } = useApi();

  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      status: "pending",
      gamesIds: [],
      physicalGamesCopiesIds: [],
      userId: 1,
    } as OrderFormValues,
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
      gamesIds: Yup.array().of(Yup.string().min(1)).min(1).required("Required"),
      physicalGamesCopiesIds: Yup.array().of(Yup.string().min(1)).min(0),
      userId: Yup.number().min(1).required("Required"),
    }),
    onSubmit: (data) => {
      postOrderAdmin({
        ...data,
        gamesIds: data.gamesIds.map((id) => +id),
        physicalGamesCopiesIds: data.physicalGamesCopiesIds.map((id) => +id),
      }).then(({ order, error }) => {
        if (error) setError(error);
        else history.push("/admin/orders");
      });
    },
  });

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Create order</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>User ID</span>
          <input
            name="userId"
            type="number"
            min="1"
            max={users.length && users.sort((a, b) => b.id - a.id)[0].id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.userIdInput}`}
            value={formik.values.userId}
          />
        </label>
        {!!formik.touched.userId && !!formik.errors.userId && (
          <p className={styles.errorMsg}>{formik.errors.userId}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Order status</span>
          <select
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.statusInput}`}
            value={formik.values.status}
          >
            <option value="cancelled">cancelled</option>
            <option value="pending">pending</option>
            <option value="received">received</option>
          </select>
        </label>
        {!!formik.touched.status && !!formik.errors.status && (
          <p className={styles.errorMsg}>{formik.errors.status}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Digital copies</span>
          <select
            name="gamesIds"
            required={formik.values.physicalGamesCopiesIds.length === 0}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.gamesInpu}`}
            value={formik.values.gamesIds.map((id) => `${id}`)}
            multiple
          >
            {games.map((game) => (
              <option value={game.id} key={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        {!!formik.touched.gamesIds && !!formik.errors.gamesIds && (
          <p className={styles.errorMsg}>{formik.errors.gamesIds}</p>
        )}

        <label className={styles.label}>
          <span className={styles.labelText}>Physical copies</span>
          <select
            name="physicalGamesCopiesIds"
            required={formik.values.gamesIds.length === 0}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.gamesInput}`}
            value={formik.values.physicalGamesCopiesIds.map((id) => `${id}`)}
            multiple
          >
            {games.map((game) => (
              <option value={game.id} key={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        {!!formik.touched.physicalGamesCopiesIds &&
          !!formik.errors.physicalGamesCopiesIds && (
            <p className={styles.errorMsg}>
              {formik.errors.physicalGamesCopiesIds}
            </p>
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
