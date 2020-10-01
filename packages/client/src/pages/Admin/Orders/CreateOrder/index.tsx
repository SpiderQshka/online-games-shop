import { useApi } from "context/api";
import { useFormik } from "formik";
import { IApiError, IGameFromApi, IUser, OrderStatus } from "interfaces/api";
import { IOrderForUI } from "interfaces/app";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";

interface OrderFormValues {
  gamesIds: number[];
  status: OrderStatus;
  userId: number;
}

interface AddOrderProps {}

export const CreateOrder: React.FunctionComponent<AddOrderProps> = () => {
  const history = useHistory();
  const { postOrderAdmin, getUsers, getGames } = useApi();
  const [games, setGames] = useState<IGameFromApi[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      status: "pending",
      gamesIds: [],
      userId: 1,
    } as OrderFormValues,
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
      gamesIds: Yup.array().of(Yup.number().min(1)).min(1).required("Required"),
      userId: Yup.number().min(1).required("Required"),
    }),
    onSubmit: (data) => {
      postOrderAdmin(data).then(({ order, error }) => {
        if (error) setError(error);
        else history.push("/admin/orders");
      });
    },
  });

  useEffect(() => {
    const processAsync = async () => {
      const { games, error } = await getGames();
      if (error) setError(error);

      const { users, error: usersError } = await getUsers();
      if (usersError) setError(usersError);

      setGames(games);
      setUsers(users);
    };
    processAsync();
  }, []);
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
          <span className={styles.labelText}>Games</span>
          <select
            name="gamesIds"
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
