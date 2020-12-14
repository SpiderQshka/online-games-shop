import React from "react";

import styles from "./styles.module.scss";

export const Loader = () => <div className={styles.loader}></div>;

export const CenteredLoader = () => (
  <div className={styles.centered}>
    <Loader />
  </div>
);

export const PageLoader = () => (
  <div className={styles.container}>
    <Loader />
  </div>
);
