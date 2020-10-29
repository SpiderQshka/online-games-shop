import { IApiError } from "interfaces/api";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";

import styles from "./styles.module.scss";

interface ErrorProps {
  error: IApiError;
}

export const Error: React.FunctionComponent<ErrorProps> = ({ error }) => (
  <div className={styles.error}>
    <FaTimesCircle className={styles.icon} />
    <h2 className={styles.errorStatus}>{error.status}</h2>
    <p className={styles.errorMsg}>{error.msg}</p>
  </div>
);

export const PageError: React.FunctionComponent<ErrorProps> = ({ error }) => (
  <div className={styles.container}>
    <Error error={error} />
  </div>
);
