import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { IApiError } from "interfaces/api";
import { useApi } from "context/api";
import { IDiscountForUI, IGameForUI } from "interfaces/app";
import moment from "moment";
import { usePopup } from "context/popup";

interface DiscountFormValues {
  gamesIds: number[];
  startDate: string;
  endDate: string;
  amount: number;
  type: "%" | "$";
}

interface UpdateDiscountProps {
  games: IGameForUI[];
  discounts: IDiscountForUI[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
  error: IApiError | null;
}

export const UpdateDiscount: React.FunctionComponent<UpdateDiscountProps> = ({
  games,
  discounts,
  updateTrigger,
  setUpdateTrigger,
  error: propsError,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { putDiscount } = useApi();
  const discount = discounts.filter((discount) => discount.id === +id)[0];
  if (!discount) history.goBack();
  const [error, setError] = useState<IApiError | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [choosenGames, setChoosenGames] = useState<IGameForUI[]>([]);

  const formik = useFormik({
    initialValues: {
      amount: discount.amount,
      endDate: moment(discount.endDate).format("YYYY-MM-DD"),
      gamesIds: discount.games.map((discount) => discount.id),
      startDate: moment(discount.startDate).format("YYYY-MM-DD"),
      type: discount.type,
    } as DiscountFormValues,
    validationSchema: Yup.object({
      endDate: Yup.string().required("Required"),
      startDate: Yup.string().required("Required"),
      gamesIds: Yup.array().of(Yup.number().min(1)).min(1).required("Required"),
      amount: Yup.number().min(1).required("Required"),
      type: Yup.string().required("Required").oneOf(["%", "$"]),
    }),
    onSubmit: (data) => {
      if (discount) {
        setIsLoading(true);
        putDiscount(discount.id, data).then(({ error }) => {
          setIsLoading(false);
          if (error) setError(error);
          else {
            setUpdateTrigger(!updateTrigger);
            history.push("/admin/discounts");
          }
        });
      }
    },
  });

  useEffect(() => {
    if (propsError) history.push("/admin/discounts");
  }, [propsError]);

  useEffect(() => {
    setChoosenGames(
      games.filter((game) =>
        formik.values.gamesIds.map((game) => +game).includes(game.id)
      )
    );
  }, [
    formik.values.gamesIds.length,
    formik.values.gamesIds[formik.values.gamesIds.length - 1],
  ]);

  const maxDiscount =
    choosenGames.map((game) => +game.price).sort((a, b) => a - b)[0] || 0;

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Update discount with id {discount?.id}</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>Start date</span>
          <input
            name="startDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.startDateInput}`}
            value={formik.values.startDate}
            max={formik.values.endDate}
          />
        </label>

        {!!formik.touched.startDate && !!formik.errors.startDate && (
          <p className={styles.errorMsg}>{formik.errors.startDate}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>End date</span>
          <input
            name="endDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.endDateInput}`}
            value={formik.values.endDate}
            min={formik.values.startDate}
          />
        </label>

        {!!formik.touched.endDate && !!formik.errors.endDate && (
          <p className={styles.errorMsg}>{formik.errors.endDate}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Discount type</span>
          <select
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.typeInput}`}
            value={formik.values.type}
          >
            <option value="%">Percents</option>
            <option value="$">Dollars</option>
          </select>
        </label>
        {!!formik.touched.type && !!formik.errors.type && (
          <p className={styles.errorMsg}>{formik.errors.type}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Amount</span>
          <input
            name="amount"
            type="number"
            min={1}
            max={formik.values.type === "%" ? 100 : maxDiscount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.amountInput}`}
            value={formik.values.amount}
          />
        </label>

        {!!formik.touched.amount && !!formik.errors.amount && (
          <p className={styles.errorMsg}>{formik.errors.amount}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Games</span>
          <select
            name="gamesIds"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.gamesInput}`}
            value={formik.values.gamesIds.map((id) => `${id}`)}
            multiple
          >
            {games.map((game) => (
              <option value={+game.id} key={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        {!!formik.touched.gamesIds && !!formik.errors.gamesIds && (
          <p className={styles.errorMsg}>{formik.errors.gamesIds}</p>
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
