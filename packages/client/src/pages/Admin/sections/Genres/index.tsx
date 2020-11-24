import React from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IApiError, IGenreFromApi } from "interfaces/api";
import { Error } from "components/Error";

interface GenresProps {
  genres: IGenreFromApi[];
  error: IApiError | null;
}

export const Genres: React.FunctionComponent<GenresProps> = ({
  genres,
  error,
}) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      {error ? (
        <Error />
      ) : (
        <>
          <h2 className={styles.header}>Genres</h2>
          <table className={styles.itemsTable}>
            <tr className={`${styles.row} ${styles.headerRow}`}>
              <th className={styles.col}>ID</th>
              <th className={styles.col}>Name</th>
              <th
                className={`${styles.col} ${styles.btnContainer}`}
                onClick={() => history.push("/admin/genres/create")}
              >
                <button className={styles.btn}>
                  <FaPlus size="25px" />
                </button>
              </th>
            </tr>
            {genres
              .sort((a, b) => a.id - b.id)
              .map((achievement) => (
                <tr className={styles.row} key={achievement.id}>
                  <td className={styles.col}>{achievement.id}</td>
                  <td className={styles.col}>{achievement.name}</td>
                  <td className={`${styles.col} ${styles.btnContainer}`}>
                    <button
                      className={styles.btn}
                      onClick={() =>
                        history.push(`/admin/genres/${achievement.id}`)
                      }
                    >
                      <BsThreeDots size="25px" />
                    </button>
                  </td>
                </tr>
              ))}
          </table>
        </>
      )}
    </div>
  );
};
