import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { IOrderForUI } from "interfaces/app";
import moment from "moment";
import { Loader } from "components/Loader";

interface OredersProps {
  orders: IOrderForUI[];
  isLoading: boolean;
}

export const Orders: React.FunctionComponent<OredersProps> = ({
  orders,
  isLoading,
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
              </li>
              {orders.map((el) => (
                <li className={styles.orderItem} key={el.id}>
                  <span className={`${styles.row} ${styles.date}`}>
                    {moment(el.createdAt).format("DD-MM-YYYY")}
                  </span>
                  <span className={`${styles.row} ${styles.games}`}>
                    {el.orderedGames.map((el) => (
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
                    ))}
                  </span>
                  <span className={`${styles.row} ${styles.price}`}>
                    {el.price}$
                  </span>
                </li>
              ))}
            </>
          ) : (
            <li className={styles.notFound}>
              You don't have any orders.. yet!
            </li>
          )}
        </ul>
      )}
    </>
  );
};
