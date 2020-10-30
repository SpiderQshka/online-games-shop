import React from "react";
import styles from "./styles.module.scss";
import { Loader } from "components/Loader";
import { IMyGameFromApi } from "interfaces/api";
import { useHistory } from "react-router-dom";

interface GamesProps {
  games: IMyGameFromApi[];
  isLoading: boolean;
}

export const Games: React.FunctionComponent<GamesProps> = ({
  games,
  isLoading,
}) => {
  const history = useHistory();
  return (
    <>
      <h2 className={styles.header}>Games</h2>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <ul className={styles.gamesList}>
          {games.length > 0 ? (
            <>
              <li className={`${styles.gameItem} ${styles.headerItem}`}>
                <span className={styles.name}>Name</span>
              </li>
              {games.map((el) => (
                <li
                  className={styles.gameItem}
                  key={el.id}
                  onClick={() => history.push(`/store/item/${el.id}`)}
                >
                  <span className={`${styles.row} ${styles.name}`}>
                    {el.name}
                    {el.isPhysical && (
                      <span className={styles.accent}>Physical copy</span>
                    )}
                  </span>
                </li>
              ))}
            </>
          ) : (
            <li className={styles.notFound}>You don't have any games.. yet!</li>
          )}
        </ul>
      )}
    </>
  );
};
