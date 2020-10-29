import { Header } from "components/Header";
import { config } from "config";
import { IApiError } from "interfaces/api";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import styles from "./styles.module.scss";

export const Error = () => {
  const history = useHistory();

  const error = history.location.state as IApiError;

  if (!error.status) history.push("/");

  return (
    <>
      <Header />
      <div className={styles.errorContainer}>
        <div className={styles.iconContainer}>
          <FaTimesCircle size="100%" color={config.colors.error} />
        </div>

        <h2 className={styles.errorStatus}>{error.status}</h2>
        <p className={styles.errorMsg}>{error.msg}</p>
      </div>
    </>
  );
};

export default Error;
