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
      <h2 className={styles.header}>Achievements</h2>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <ul className={styles.achievementsList}>
          {achievements.length > 0 ? (
            <>
              <li className={`${styles.achievementItem} ${styles.headerItem}`}>
                <span className={`${styles.row} ${styles.achievementName}`}>
                  Name
                </span>
                <span className={`${styles.row} ${styles.achievementDiscount}`}>
                  Discount
                </span>
              </li>
              {achievements.map((el) => (
                <li className={`${styles.achievementItem}`} key={el.id}>
                  <span className={`${styles.row} ${styles.achievementName}`}>
                    {el.name}
                  </span>
                  <span
                    className={`${styles.row} ${styles.achievementDiscount}`}
                  >{`${el.discount}%`}</span>
                </li>
              ))}
              <li className={`${styles.achievementItem} ${styles.footerItem}`}>
                <span className={`${styles.row} ${styles.achievementDiscount}`}>
                  Total discount
                </span>
                <span className={`${styles.row} ${styles.achievementDiscount}`}>
                  {achievements.reduce((prev, curr) => prev + curr.discount, 0)}
                  %
                </span>
              </li>
            </>
          ) : (
            <li className={styles.notFound}>
              {error
                ? "Error occured while loading achievements"
                : "You don't have any achievements.. yet!"}
            </li>
          )}
        </ul>
      )}
    </>
  );
};
