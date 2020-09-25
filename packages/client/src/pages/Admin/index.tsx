import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { MdDashboard } from "react-icons/md";
import { RiShoppingCart2Line } from "react-icons/ri";

import styles from "./styles.module.scss";

export const Admin = () => {
  return (
    <div className={styles.adminContainer}>
      {/* <div className={styles.adminContent}> */}
      <div className={styles.menuContainer}>
        <h2 className={styles.header}>Menu</h2>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link to="/admin/dashboard" className={styles.menuLink}>
              <MdDashboard size="20px" className={styles.icon} /> Dashboard
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/admin/orders" className={styles.menuLink}>
              <RiShoppingCart2Line size="20px" className={styles.icon} />
              Orders
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.dataContainer}>
        <Switch>
          <Route path="/admin/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </div>
    // </div>
  );
};

export default Admin;
