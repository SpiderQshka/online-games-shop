import React from "react";
import { FaGamepad, FaMailBulk, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

export const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <p className={styles.textInfo}>
          © 2020, Online Games Store, Inc. All rights reserved.
        </p>
        <ul className={styles.linksList}>
          <li className={styles.listItem}>
            <Link to="#" className={styles.link}>
              <FaTelegram className={styles.icon} size="100%" />
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link to="#" className={styles.link}>
              <FaMailBulk className={styles.icon} size="100%" />
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link to="#" className={styles.link}>
              <FaGamepad className={styles.icon} size="100%" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
