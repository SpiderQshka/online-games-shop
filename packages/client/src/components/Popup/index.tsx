import { config } from "config";
import { usePopup } from "context/popup";
import React from "react";
import { FaCheck, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import styles from "./styles.module.scss";

export const Popup: React.FunctionComponent = () => {
  const { isOpen, msg, type, hidePopup } = usePopup();

  if (isOpen) setTimeout(hidePopup, config.popupTimeout);

  return (
    <div
      className={`${styles.popupContainer} ${isOpen && styles.open} ${
        styles[type]
      }`}
    >
      {type === "neutral" && (
        <FaInfoCircle size={"1.5em"} className={styles.icon} />
      )}
      {type === "success" && <FaCheck size={"1.5em"} className={styles.icon} />}
      {type === "error" && (
        <FaTimesCircle size={"1.5em"} className={styles.icon} />
      )}
      <p className={styles.popupMsg}>{msg}</p>
    </div>
  );
};
