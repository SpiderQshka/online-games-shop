import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { IOrderForUI } from "interfaces/app";
import moment from "moment";
import { Loader } from "components/Loader";
import { IApiError } from "interfaces/api";

interface OrdersProps {
  orders: IOrderForUI[];
  isLoading: boolean;
  error: IApiError | null;
}

export const Orders: React.FunctionComponent<OrdersProps> = ({
  orders,
  isLoading,
  error,
}) => {
  return (
    <>
      <h2 className={styles.header}>Orders</h2>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <table className={styles.ordersTable}>
          {orders.length > 0 ? (
            <>
              <tr className={`${styles.orderItem} ${styles.headerItem}`}>
                <td className={`${styles.row} ${styles.date}`}>Date</td>
                <td className={`${styles.row} ${styles.games}`}>Games</td>
                <td className={`${styles.row} ${styles.price}`}>Price</td>
                <td className={`${styles.row} ${styles.status}`}>Status</td>
              </tr>
              {orders.map((el) => (
                <tr className={styles.orderItem} key={el.id}>
                  <td className={`${styles.row} ${styles.date}`}>
                    {moment(el.createdAt).format("DD-MM-YYYY")}
                  </td>
                  <td className={`${styles.row} ${styles.games}`}>
                    {el.orderedGames.length ? (
                      el.orderedGames.map((el) => (
                        <Link
                          to={`/store/item/${el.id}`}
                          className={styles.gameName}
                          key={el.id}
                        >
                          {el.name}
                          {el.isPhysical && (
                            <span className={styles.accent}>Physical copy</span>
                          )}
                          {el.dublicatesNumber > 1 && (
                            <span className={styles.number}>
                              ({el.dublicatesNumber})
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <span className={styles.gameName}>Not loaded</span>
                    )}
                  </td>
                  <td className={`${styles.row} ${styles.price}`}>
                    {el.price}$
                  </td>
                  <td className={`${styles.row} ${styles.status}`}>
                    {el.status}
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr className={styles.notFound}>
              {error
                ? "Error occured while loading orders"
                : "You don't have any orders.. yet!"}
            </tr>
          )}
        </table>
      )}
    </>
  );
};
