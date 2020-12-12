import React from "react";
import styles from "./styles.module.scss";
import { IAchievementFromApi, IApiError } from "interfaces/api";
import { Loader } from "components/Loader";

interface AchievementsProps {
  achievements: IAchievementFromApi[];
  isLoading: boolean;
  error: IApiError | null;
}

export const Achievements: React.FunctionComponent<AchievementsProps> = ({
  achievements,
  isLoading,
  error,
}) => {
  return (
    <>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <>
          <h2 className={styles.header}>Achievements</h2>
          <table className={styles.achievementsTable}>
            {achievements.length > 0 ? (
              <>
                <tr
                  className={`${styles.achievementItem} ${styles.headerItem}`}
                >
                  <td className={`${styles.row} ${styles.achievementName}`}>
                    Name
                  </td>
                  <td className={`${styles.row} ${styles.achievementDiscount}`}>
                    Discount
                  </td>
                </tr>
                {achievements.map((el, i) => (
                  <tr
                    className={`${styles.achievementItem} ${
                      i === achievements.length - 1 && styles.lastItem
                    }`}
                    key={el.id}
                  >
                    <td className={`${styles.row} ${styles.achievementName}`}>
                      {el.name}
                    </td>
                    <td
                      className={`${styles.row} ${styles.achievementDiscount}`}
                    >{`${el.discount}%`}</td>
                  </tr>
                ))}
                <tr
                  className={`${styles.achievementItem} ${styles.footerItem}`}
                >
                  <td className={`${styles.row} ${styles.achievementDiscount}`}>
                    Total discount
                  </td>
                  <td className={`${styles.row} ${styles.achievementDiscount}`}>
                    {achievements.reduce(
                      (prev, curr) => prev + curr.discount,
                      0
                    )}
                    %
                  </td>
                </tr>
              </>
            ) : (
              <tr className={styles.notFound}>
                {error
                  ? "Error occured while loading achievements"
                  : "You don't have any achievements.. yet!"}
              </tr>
            )}
          </table>
        </>
      )}
    </>
  );
};
