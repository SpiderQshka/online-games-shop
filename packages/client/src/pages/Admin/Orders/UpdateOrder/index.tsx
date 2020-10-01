import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { IApiError, OrderStatus } from "interfaces/api";
import { useApi } from "context/api";
import { IOrderForUI } from "interfaces/app";

interface OrderFormValues {
  status: OrderStatus;
}

interface OrderItemProps {
  orders: IOrderForUI[];
}

export const UpdateOrder: React.FunctionComponent<OrderItemProps> = ({
  orders,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { putOrder } = useApi();
  const order = orders.filter((order) => order.id === +id)[0];
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: { status: "pending" } as OrderFormValues,
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
    }),
    onSubmit: (data) => {
      order &&
        putOrder(
          {
            gamesIds: order.orderedGames.map((game) => game.id),
            status: data.status,
          },
          order.id
        ).then(({ order, error }) => {
          if (error) setError(error);
          else history.push("/admin/orders");
        });
    },
  });
  useEffect(() => {
    order && formik.setFieldValue("status", order.status);
  }, []);
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
