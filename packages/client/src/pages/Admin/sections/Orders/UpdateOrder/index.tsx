import { useFormik } from "formik";
import React, { useState } from "react";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { IApiError, OrderStatus } from "interfaces/api";
import { useApi } from "context/api";
import { IGameForUI, IOrderWithUserId } from "interfaces/app";

interface OrderFormValues {
  gamesIds: string[];
  status: OrderStatus;
  physicalGamesCopiesIds: string[];
}

interface OrderItemProps {
  orders: IOrderWithUserId[];
  games: IGameForUI[];
}

export const UpdateOrder: React.FunctionComponent<OrderItemProps> = ({
  orders,
  games,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { putOrder } = useApi();
  const order = orders.filter((order) => order.id === +id)[0];
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      status: order.status,
      gamesIds: order.orderedGames
        .filter((el) => !el.isPhysical)
        .map((game) => `${game.id}`),
      physicalGamesCopiesIds: order.orderedGames
        .filter((el) => el.isPhysical)
        .map((el) => `${el.id}`),
    } as OrderFormValues,
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
      gamesIds: Yup.array().of(Yup.string().min(1)).min(1).required("Required"),
      physicalGamesCopiesIds: Yup.array().of(Yup.number().min(1)).min(1),
    }),
    onSubmit: (data) => {
      order &&
        putOrder(order.id, {
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
      <h2 className={styles.header}>Update order with id {order?.id}</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
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
            className={`${styles.input} ${styles.gamesInput}`}
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
          Update
        </button>
        {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
      </form>
    </div>
  );
};
