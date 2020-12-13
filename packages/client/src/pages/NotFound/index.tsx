import { Header } from "components/Header";
import React from "react";
import { useHistory } from "react-router-dom";
import { setPageTitle } from "utils/helpers";
import styles from "./styles.module.scss";

export const NotFound = () => {
  const history = useHistory();
  setPageTitle("Oops!");
  return (
    <>
      <Header />
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.error}>404</h1>
          <p className={styles.description}>
            We didn't find page you are looking for. Check the link or go back
            to the main page
          </p>
          <button className={styles.btn} onClick={() => history.push("/store")}>
            Main page
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
