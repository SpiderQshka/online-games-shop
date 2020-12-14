import React from "react";
import styles from "./styles.module.scss";

interface ErrorProps {
  msg?: string;
}

export const Error: React.FunctionComponent<ErrorProps> = ({ msg }) => (
  <div className={styles.errorContainer}>
    <h1 className={styles.errorHeader}>Oops!</h1>
    <h2 className={styles.errorStatus}>Something went wrong!</h2>
    {msg && <p className={styles.errorMsg}>{msg}</p>}
    <p className={styles.errorAdvise}>
      Check your internet connection and try to reload this page
    </p>
  </div>
);
