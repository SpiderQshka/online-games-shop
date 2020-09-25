import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { IGame } from "interfaces/api";

interface OredersProps {
  orders: {
    id: number;
    games: IGame[];
    createdAt: string;
    price: number;
  }[];
}

export const Orders: React.FunctionComponent<OredersProps> = ({ orders }) => {
  return (
    <>
      <h2 className={styles.header}>Orders</h2>
      <ul className={styles.ordersList}>
        {!!orders.length ? (
          <>
            <li className={`${styles.orderItem} ${styles.headerItem}`}>
              <span className={styles.date}>Date</span>
              <span className={styles.name}>Games</span>
              <span className={styles.price}>Price</span>
            </li>
            {orders.map((el) => (
              <li className={styles.orderItem} key={el.id}>
                <span className={styles.date}>{el.createdAt}</span>
                <span className={styles.games}>
                  {el.games.map((el) => (
                    <Link
                      to={`/store/item/${el.id}`}
                      className={styles.gameName}
                    >
                      {el.name}
                    </Link>
                  ))}
                </span>
                <span className={styles.price}>{el.price}$</span>
              </li>
            ))}
          </>
        ) : (
          <li className={styles.notFound}>You don't have any orders.. yet!</li>
        )}
      </ul>
    </>
  );
};
