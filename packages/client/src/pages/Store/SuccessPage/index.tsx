import { Header } from "components/Header";
import { IOrderForUI } from "interfaces/app";
import React from "react";
import { useHistory } from "react-router-dom";
import { TiInputChecked } from "react-icons/ti";

import styles from "./styles.module.scss";

export const SuccessPage: React.FunctionComponent = () => {
  const history = useHistory();
  if (!history.location.state) history.push("/");

  const order = history.location.state as IOrderForUI;

  return (
    <>
      <Header />
      <div className={styles.successPageContainer}>
        <div className={styles.successPageContent}>
          <div className={styles.iconContainer}>
            <TiInputChecked size="100%" color="#5a9516" />
          </div>
          <h1 className={styles.header}>That's it!</h1>
          <p className={styles.description}>
            You successfully ordered {order.orderedGames.length} game[s]! <br />
            Now you can see them in your profile!
          </p>
          <button
            className={styles.btn}
            onClick={() => history.push("/profile")}
          >
            Go to my profile
          </button>
        </div>
      </div>
    </>
  );
};
