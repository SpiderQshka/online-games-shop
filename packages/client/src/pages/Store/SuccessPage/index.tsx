import { Header } from "components/Header";
import React from "react";
import { useHistory } from "react-router-dom";

import styles from "./styles.module.scss";

export const SuccessPage = () => {
  const history = useHistory();
  return (
    <>
      <Header />
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.error}>That's it!</h1>
          <p className={styles.description}>
            You successfully ordered game[s]!
          </p>
          <button className={styles.btn} onClick={() => history.push("/store")}>
            Main page
          </button>
        </div>
      </div>
    </>
  );
};
