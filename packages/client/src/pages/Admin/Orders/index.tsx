import { IOrderForUI } from "interfaces/app";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
interface OrdersProps {
  orders: IOrderForUI[];
}

export const Orders: React.FunctionComponent<OrdersProps> = ({ orders }) => {
  const history = useHistory();

  return (
    <div className={styles.ordersContent}>
      <h2 className={styles.header}>Orders</h2>
      <ul className={styles.ordersList}>
        <li className={`${styles.orderItem} ${styles.headerItem}`}>
          <span>ID</span>
          <span>Created At</span>
          <span>Price</span>
          <span>Status</span>
          <span>Games</span>
          <span
            className={styles.addBtn}
            onClick={() => history.push("/admin/orders/create")}
          >
            <FaPlus size="25px" />
          </span>
        </li>
        {orders
          .sort((a, b) => a.id - b.id)
          .map((order) => (
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
  );
};
