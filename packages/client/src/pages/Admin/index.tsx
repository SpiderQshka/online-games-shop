import React, { useState } from "react";
import { MdUpdate } from "react-icons/md";
import styles from "./styles.module.scss";
import { FaBars } from "react-icons/fa";
import { Menu } from "./Menu";
import { Routes } from "./Routes";
import { setPageTitle } from "utils/helpers";

export const Admin = () => {
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  setPageTitle("Admin panel");

  return (
    <div
      className={`${styles.adminContainer} ${isMenuOpen && styles.overlay}`}
      onClick={() => setIsMenuOpen(false)}
    >
      <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className={styles.dataContainer}>
        <div
          className={styles.actionsBlock}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.btn}
            onClick={() => {
              setUpdateTrigger(!updateTrigger);
              setIsMenuOpen(false);
            }}
          >
            <MdUpdate size="100%" />
          </button>
          <button
            className={`${styles.btn} ${styles.menuBtn}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size="100%" />
          </button>
        </div>
        <Routes
          isLoading={isLoading}
          updateTrigger={updateTrigger}
          setIsLoading={setIsLoading}
          setUpdateTrigger={setUpdateTrigger}
        />
      </div>
    </div>
  );
};

export default Admin;
