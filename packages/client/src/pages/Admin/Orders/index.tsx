import { IOrderForUI } from "interfaces/app";
import React from "react";
import { Route, useHistory } from "react-router-dom";
import { OrderItem } from "./OrderItem";
import styles from "./styles.module.scss";
import moment from "moment";
interface OrdersProps {
  orders: IOrderForUI[];
}

export const Orders: React.FunctionComponent<OrdersProps> = ({ orders }) => {
  const history = useHistory();

  return (
    <>
      <div className={styles.ordersContent}>
        <h2 className={styles.header}>Orders</h2>
        <ul className={styles.ordersList}>
          <li className={`${styles.orderItem} ${styles.headerItem}`}>
            <span>ID</span>
            <span>Created At</span>
            <span>Price</span>
            <span>Status</span>
            <span>Games</span>
          </li>
          {orders.map((order) => (
            <li
              className={styles.orderItem}
              key={order.id}
              onClick={() => history.push(`/admin/orders/${order.id}`)}
            >
              <span>{order.id}</span>
              <span>{moment(order.createdAt).format("DD-MM-YYYY")}</span>
              <span>{order.price}</span>
              <span>{order.status}</span>
              <span>
                {order.orderedGames.reduce(
                  (prev, curr, i) => (i ? `${prev}, ${curr.name}` : curr.name),
                  ""
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
