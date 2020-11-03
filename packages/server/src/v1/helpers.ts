import { Achievement, AchievementName } from "models/Achievement";
import { Discount } from "models/Discount";
import { Game } from "models/Game";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { IDiscount, IGame } from "models/types";
import { UnlockedAchievement } from "models/UnlockedAchievement";
import { UsedDiscount } from "models/UsedDiscount";

export const doesCurrentDateSuitDiscount = (discount: Discount) => {
  return (
    !!discount.amount &&
    new Date(discount.startDate) < new Date() &&
    new Date(discount.endDate) > new Date()
  );
};

export const getHightestGameDiscount = async (game: IGame) => {
  const gameDiscountsIds = (
    await UsedDiscount.query().where("gameId", game.id)
  ).map((el) => el.discountId);
  const discounts = await Discount.query();
  const hightestDiscount = discounts
    .filter((el) => gameDiscountsIds.includes(el.id))
    .reduce((prev, curr) => {
      const prevDisountInPercents =
        prev.type === "%"
          ? prev.amount
          : ((game.price - (game.price - prev.amount)) / game.price) * 100;
      const currDisountInPercents =
        curr.type === "%"
          ? curr.amount
          : ((game.price - (game.price - curr.amount)) / game.price) * 100;

      return prevDisountInPercents > currDisountInPercents ? prev : curr;
    }, {} as Discount);
  return hightestDiscount.amount ? hightestDiscount : null;
};

export const getAchievementDiscount = async (userId: number) => {
  const achievements = await Achievement.query();
  const achievementsIds = achievements.map((el) => el.id);
  const unlockedAchievements = await UnlockedAchievement.query().where(
    "userId",
    userId
  );
  const userAchievements = unlockedAchievements
    .filter((el) => achievementsIds.includes(el.achievementId))
    .map((el) => achievements.filter((ach) => ach.id === el.achievementId)[0]);
  return userAchievements.reduce((prev, curr) => prev + +curr.discount, 0);
};

const getGamePriceWithDiscount: (config: {
  gamePrice: number;
  discountSize: number;
  discountType: "%" | "$";
}) => number = ({ discountSize, discountType, gamePrice }) => {
  const discountIsPercents =
    discountType === "%" ? discountSize : (discountSize / gamePrice) * 100;
  return (gamePrice * (100 - discountIsPercents)) / 100;
};

interface IGetOptimalGamePrice {
  achievementDiscountSize: number;
  gameDiscount: IDiscount | null;
  game: IGame;
  isPhysical?: boolean;
}

export const getOptimalGamePrice = ({
  achievementDiscountSize,
  gameDiscount,
  game,
  isPhysical,
}: IGetOptimalGamePrice) => {
  if (!isPhysical) {
    const gamePriceWithGameDiscount = gameDiscount
      ? getGamePriceWithDiscount({
          discountSize: gameDiscount.amount,
          discountType: gameDiscount.type,
          gamePrice: game.price,
        })
      : game.price;
    const gamePriceWithAchievement = getGamePriceWithDiscount({
      discountSize: achievementDiscountSize,
      gamePrice: game.price,
      discountType: "%",
    });

    return gamePriceWithAchievement < gamePriceWithGameDiscount
      ? gamePriceWithAchievement
      : gamePriceWithGameDiscount;
  } else {
    const gamePriceWithGameDiscount = gameDiscount
      ? getGamePriceWithDiscount({
          discountSize: gameDiscount.amount,
          discountType: gameDiscount.type,
          gamePrice: game.physicalCopyPrice,
        })
      : game.physicalCopyPrice;
    const gamePriceWithAchievement = getGamePriceWithDiscount({
      discountSize: achievementDiscountSize,
      gamePrice: game.physicalCopyPrice,
      discountType: "%",
    });

    return gamePriceWithAchievement < gamePriceWithGameDiscount
      ? gamePriceWithAchievement
      : gamePriceWithGameDiscount;
  }
};

const doesUserHaveAchievement = async (
  userId: number,
  achName: AchievementName
) => {
  const achievements = await Achievement.query();
  const requiredAchievement = achievements.filter(
    (el) => el.name === achName
  )[0];

  const userUnlockedAchievements = await UnlockedAchievement.query().where(
    "userId",
    userId
  );
  const userAchievementsIds = userUnlockedAchievements.map(
    (el) => el.achievementId
  );
  const userAchievements = (await Achievement.query()).filter((el) =>
    userAchievementsIds.includes(el.id)
  );
  const resultAchievement = userAchievements.filter(
    (el) => el.name === achName
  )[0];

  return { exists: !!resultAchievement, id: requiredAchievement.id };
};

export const checkAchievements = async (userId: number) => {
  const userOrderedGames = await OrderedGame.query().where("userId", userId);
  const userOrderedGamesIds = userOrderedGames.map((el) => el.gameId);
  const userGames = (await Game.query()).filter((game) =>
    userOrderedGamesIds.includes(game.id)
  );

  if (userGames.length === 1) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 1 game");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
      });
    }
  } else if (userGames.length >= 2) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 2 games");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
      });
    }
  } else if (userGames.length >= 10) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 10 games");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
      });
    }
  }
};
