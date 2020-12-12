import React from "react";
import styles from "./styles.module.scss";
import { Loader } from "components/Loader";
import { IApiError, IMyGameFromApi } from "interfaces/api";
import { useHistory } from "react-router-dom";

interface GamesProps {
  games: IMyGameFromApi[];
  isLoading: boolean;
  error: IApiError | null;
}

export const Games: React.FunctionComponent<GamesProps> = ({
  games,
  isLoading,
  error,
}) => {
  const history = useHistory();
  return (
    <>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <>
          <h2 className={styles.header}>Games</h2>
          <table className={styles.gamesTable}>
            {games.length > 0 ? (
              <>
                <tr className={`${styles.gameItem} ${styles.headerItem}`}>
                  <td className={`${styles.row} ${styles.name}`}>Name</td>
                </tr>
                {games.map((el) => (
                  <tr
                    className={styles.gameItem}
                    key={el.id}
                    onClick={() => history.push(`/store/item/${el.id}`)}
                  >
                    <td className={`${styles.row} ${styles.name}`}>
                      {el.name}
                      {el.isPhysical && (
                        <span className={styles.accent}>Physical copy</span>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr className={styles.notFound}>
                {error
                  ? "Error occured while loading games"
                  : "You don't have any games.. yet!"}
              </tr>
            )}
          </table>
        </>
      )}
    </>
  );
};
