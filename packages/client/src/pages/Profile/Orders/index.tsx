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
        <ul className={styles.ordersList}>
          {orders.length > 0 ? (
            <>
              <li className={`${styles.orderItem} ${styles.headerItem}`}>
                <span className={styles.date}>Date</span>
                <span className={styles.name}>Games</span>
                <span className={styles.price}>Price</span>
                <span className={styles.status}>Status</span>
              </li>
              {orders.map((el) => (
                <li className={styles.orderItem} key={el.id}>
                  <span className={`${styles.row} ${styles.date}`}>
                    {moment(el.createdAt).format("DD-MM-YYYY")}
                  </span>
                  <span className={`${styles.row} ${styles.games}`}>
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
                        </Link>
                      ))
                    ) : (
                      <li className={styles.gameName}>Not loaded</li>
                    )}
                  </span>
                  <span className={`${styles.row} ${styles.price}`}>
                    {el.price}$
                  </span>
                  <span className={`${styles.row} ${styles.status}`}>
                    {el.status}
                  </span>
                </li>
              ))}
            </>
          ) : (
            <li className={styles.notFound}>
              {error
                ? "Error occured while loading orders"
                : "You don't have any orders.. yet!"}
            </li>
          )}
        </ul>
      )}
    </>
  );
};
