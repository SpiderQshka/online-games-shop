import React from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IDiscountForUI } from "interfaces/app";

interface DiscountsProps {
  discounts: IDiscountForUI[];
}

export const Discounts: React.FunctionComponent<DiscountsProps> = ({
  discounts,
}) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      <h2 className={styles.header}>Discounts</h2>
      <table className={styles.itemsTable}>
        <tr className={`${styles.row} ${styles.headerRow}`}>
          <th className={styles.col}>ID</th>
          <th className={styles.col}>Start date</th>
          <th className={styles.col}>End date</th>
          <th className={styles.col}>Amount</th>
          <th className={styles.col}>Games</th>
          <th
            className={`${styles.col} ${styles.btnContainer}`}
            onClick={() => history.push("/admin/discounts/create")}
          >
            <button className={styles.btn}>
              <FaPlus size="25px" />
            </button>
          </th>
        </tr>
        {discounts
          .sort((a, b) => a.id - b.id)
          .map((discount) => (
            <tr className={styles.row} key={discount.id}>
              <td className={styles.col}>{discount.id}</td>
              <td className={styles.col}>
                {moment(discount.startDate).format("DD-MM-YYYY")}
              </td>
              <td className={styles.col}>
                {moment(discount.endDate).format("DD-MM-YYYY")}
              </td>
              <td className={styles.col}>{discount.amount}</td>
              <td className={`${styles.col} ${styles.list}`}>
                {discount.games.map((game) => (
                  <li key={game.id} className={styles.listItem}>
                    {game.name}
                  </li>
                ))}
              </td>
              <td className={`${styles.col} ${styles.btnContainer}`}>
                <button
                  className={styles.btn}
                  onClick={() =>
                    history.push(`/admin/discounts/${discount.id}`)
                  }
                >
                  <BsThreeDots size="25px" />
                </button>
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
};
