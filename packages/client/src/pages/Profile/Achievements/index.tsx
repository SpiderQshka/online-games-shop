import React from "react";
import styles from "./styles.module.scss";
import { IAchievement } from "interfaces/api";

interface AchievementsProps {
  achievements: IAchievement[];
}

export const Achievements: React.FunctionComponent<AchievementsProps> = ({
  achievements,
}) => {
  return (
    <>
      <h2 className={styles.header}>Achievements</h2>
      <ul className={styles.achievementsList}>
        {!!achievements.length ? (
          <>
            <li className={`${styles.achievementItem} ${styles.headerItem}`}>
              <span className={styles.achievementName}>Achievement name</span>
              <span className={styles.achievementDiscount}>
                Achievement discount
              </span>
            </li>
            {achievements.map((el) => (
              <li className={styles.achievementItem}>
                <span className={styles.achievementName}>{el.name}</span>
                <span
                  className={styles.achievementDiscount}
                >{`${el.discount}%`}</span>
              </li>
            ))}
            <li className={`${styles.achievementItem} ${styles.footerItem}`}>
              <span className={styles.achievementName}>Total discount</span>
              <span className={styles.achievementDiscount}>
                {achievements.reduce((prev, curr) => prev + curr.discount, 0)}%
              </span>
            </li>{" "}
          </>
        ) : (
          <li className={styles.notFound}>
            You don't have any achievements.. yet!
          </li>
        )}
      </ul>
    </>
  );
};
