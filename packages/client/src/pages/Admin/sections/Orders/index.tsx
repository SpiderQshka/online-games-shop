import { IOrderWithUserId } from "interfaces/app";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IApiError } from "interfaces/api";
import { Error } from "components/Error";
import _ from "lodash";

interface OrdersProps {
  orders: IOrderWithUserId[];
  error: IApiError | null;
}

export const Orders: React.FunctionComponent<OrdersProps> = ({
  orders,
  error,
}) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      {error ? (
        <Error />
      ) : (
        <>
          <h2 className={styles.header}>Orders</h2>
          <table className={styles.itemsTable}>
            <tr className={`${styles.row} ${styles.headerRow}`}>
              <th className={styles.col}>ID</th>
              <th className={styles.col}>User ID</th>
              <th className={styles.col}>Created At</th>
              <th className={styles.col}>Price</th>
              <th className={styles.col}>Status</th>
              <th className={styles.col}>Games</th>
              <th
                className={`${styles.col} ${styles.btnContainer}`}
                onClick={() => history.push("/admin/orders/create")}
              >
                <button className={styles.btn}>
                  <FaPlus size="25px" />
                </button>
              </th>
            </tr>
            {orders
              .sort((a, b) => a.id - b.id)
              .map((order) => {
                // const uniqOrderedGames = _.uniqBy(order.orderedGames, "id");
                // const gamesIds = order.orderedGames.map((el) => el.id);
                return (
                  <tr className={styles.row} key={order.id}>
                    <td className={styles.col}>{order.id}</td>
                    <td className={styles.col}>{order.userId}</td>
                    <td className={styles.col}>
                      {moment(order.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td className={styles.col}>{order.price}</td>
                    <td className={styles.col}>{order.status}</td>
                    <td className={`${styles.col} ${styles.list}`}>
                      {order.orderedGames.map((el) => (
                        <li className={styles.listItem} key={el.id}>
                          {el.name}
                          {el.isPhysical && (
                            <span className={styles.accent}>Physical copy</span>
                          )}
                          {el.dublicatesNumber > 1 && (
                            <span className={styles.number}>
                              ({el.dublicatesNumber})
                            </span>
                          )}
                        </li>
                      ))}
                    </td>
                    <td className={`${styles.col} ${styles.btnContainer}`}>
                      <button
                        className={styles.btn}
                        onClick={() =>
                          history.push(`/admin/orders/${order.id}`)
                        }
                      >
                        <BsThreeDots size="25px" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </table>
        </>
      )}
    </div>
  );
};
