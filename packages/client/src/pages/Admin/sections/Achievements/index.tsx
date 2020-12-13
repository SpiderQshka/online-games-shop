import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import { BsThreeDots } from "react-icons/bs";
import { IAchievementFromApi, IApiError } from "interfaces/api";
import { Error } from "components/Error";
import { usePopup } from "context/popup";

interface AchievementsProps {
  achievements: IAchievementFromApi[];
  error: IApiError | null;
}

export const Achievements: React.FunctionComponent<AchievementsProps> = ({
  achievements,
  error,
}) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      {error ? (
        <Error />
      ) : (
        <>
          <h2 className={styles.header}>Achievements</h2>
          <table className={styles.itemsTable}>
            <tr className={`${styles.row} ${styles.headerRow}`}>
              <th className={styles.col}>ID</th>
              <th className={styles.col}>Name</th>
              <th className={styles.col}>Discount</th>
              <th className={styles.col}></th>
            </tr>
            {achievements
              .sort((a, b) => a.id - b.id)
              .map((achievement) => (
                <tr className={styles.row} key={achievement.id}>
                  <td className={styles.col}>{achievement.id}</td>
                  <td className={styles.col}>{achievement.name}</td>
                  <td className={`${styles.col}`}>{achievement.discount}%</td>
                  <td className={`${styles.col} ${styles.btnContainer}`}>
                    <button
                      className={styles.btn}
                      onClick={() =>
                        history.push(`/admin/achievements/${achievement.id}`)
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
