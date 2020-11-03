import { useApi } from "context/api";
import React, { useEffect } from "react";
import { setUnlockedAchievementsNumber } from "utils/helpers";

export const SetUnlockedAchievements = () => {
  const { getUserAchievements } = useApi();
  useEffect(() => {
    const processAchievements = async () => {
      const { achievements } = await getUserAchievements();
      if (achievements && achievements.length)
        setUnlockedAchievementsNumber(achievements.length);
      else setUnlockedAchievementsNumber(0);
    };
    processAchievements();
  }, []);
  return <></>;
};
