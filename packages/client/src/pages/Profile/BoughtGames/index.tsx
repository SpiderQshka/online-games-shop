import React from "react";
import styles from "./styles.module.scss";

interface AchievementsProps {
  achievements: { name: string; discountSize: number }[];
}

export const Achievements: React.FunctionComponent<AchievementsProps> = ({
  achievements,
}) => {
  return (
    <>
      <h2 className={styles.header}>Achievements</h2>
      <ul className={styles.achievementsList}>
        {achievements.length > 0 ? (
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
                >{`${el.discountSize}%`}</span>
              </li>
            ))}
            <li className={`${styles.achievementItem} ${styles.footerItem}`}>
              <span className={styles.achievementName}>Total discount</span>
              <span className={styles.achievementDiscount}>
                {achievements.reduce(
                  (prev, curr) => prev + curr.discountSize,
                  0
                )}
                %
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
