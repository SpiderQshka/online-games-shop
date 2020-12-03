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
  physicalCopiesData: { gameId: number; numberOfCopies: number }[];
}

interface AddOrderProps {
  games: IGameForUI[];
  users: IUser[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const CreateOrder: React.FunctionComponent<AddOrderProps> = ({
  games,
  users,
  setUpdateTrigger,
  updateTrigger,
}) => {
  const history = useHistory();
  const { postOrderAdmin } = useApi();

  const [error, setError] = useState<IApiError | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      status: "pending",
      gamesIds: [],
      physicalGamesCopiesIds: [],
      userId: 1,
      physicalCopiesData: [],
    } as OrderFormValues,
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
      gamesIds: Yup.array().of(Yup.string().min(1)).min(0),
      physicalGamesCopiesIds: Yup.array().of(Yup.string().min(1)).min(0),
      userId: Yup.number().min(1).required("Required"),
    }),
    onSubmit: (data) => {
      setIsLoading(true);
      postOrderAdmin({
        status: data.status,
        userId: data.userId,
        gamesIds: data.gamesIds.map((id) => +id),
        physicalGamesCopiesIds: data.physicalGamesCopiesIds
          .map((id) => +id)
          .map((id) =>
            new Array(
              data.physicalCopiesData.filter(
                (data) => data.gameId === id
              )[0].numberOfCopies
            ).fill(id)
          )
          .flat(),
      }).then(({ error }) => {
        setIsLoading(false);
        if (error) setError(error);
        else {
          setUpdateTrigger(!updateTrigger);
          history.push("/admin/orders");
        }
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
            onChange={(e) => {
              const physicalGamesCopiesIds = [...e.currentTarget.options]
                .filter((o) => o.selected)
                .map((option) => option.value);
              formik.setValues({
                ...formik.values,
                physicalGamesCopiesIds,
                physicalCopiesData: physicalGamesCopiesIds.map((el) => {
                  return {
                    gameId: +el,
                    numberOfCopies:
                      formik.values.physicalCopiesData.filter(
                        (data) => data.gameId === +el
                      )[0]?.numberOfCopies || 1,
                  };
                }),
              });
            }}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.gamesInput}`}
            value={formik.values.physicalGamesCopiesIds}
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

        {formik.values.physicalCopiesData.map((el) => {
          const game = games.filter((game) => game.id === el.gameId)[0];
          return (
            <label className={styles.label}>
              <span
                className={styles.labelText}
              >{`"${game.name}" - copies number`}</span>
              <input
                name={`${game.name} copies`}
                type="number"
                min="1"
                max={game.numberOfPhysicalCopies}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  formik.setValues({
                    ...formik.values,
                    physicalCopiesData: formik.values.physicalCopiesData.map(
                      (data) =>
                        data.gameId === game.id
                          ? { numberOfCopies: +value, gameId: game.id }
                          : data
                    ),
                  });
                }}
                onBlur={formik.handleBlur}
                className={`${styles.input} ${styles.physicalCopiesDataInput}`}
                value={
                  formik.values.physicalCopiesData.filter(
                    (data) => data.gameId === el.gameId
                  )[0].numberOfCopies
                }
              />
            </label>
          );
        })}
        {!!formik.touched.userId && !!formik.errors.userId && (
          <p className={styles.errorMsg}>{formik.errors.userId}</p>
        )}
        <div
          className={`${styles.actionsBlock} ${isLoading && styles.loading}`}
        >
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
