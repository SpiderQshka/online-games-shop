import { Achievement, AchievementName } from "models/Achievement";
import { Discount } from "models/Discount";
import { Game } from "models/Game";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { IDiscount, IGame } from "models/types";
import { UnlockedAchievement } from "models/UnlockedAchievement";
import { UsedDiscount } from "models/UsedDiscount";
import axios from "axios";
import FormData from "form-data";
import { Models } from "models";

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
  const userAchievements = ((await UnlockedAchievement.query()
    .where("userId", userId)
    .join(
      Models.achievements.tableName,
      `${Models.unlockedAchievements.tableName}.achievementId`,
      `${Models.achievements.tableName}.id`
    )
    .select(`${Models.achievements.tableName}.discount`)) as any) as {
    discount: number;
  }[];

  const achievementDiscount = userAchievements.reduce(
    (prev, curr) => prev + +curr.discount,
    0
  );
  return achievementDiscount > 100 ? 100 : achievementDiscount;
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

  const userUnlockedAchievements = ((await UnlockedAchievement.query()
    .where("userId", userId)
    .join(
      Models.achievements.tableName,
      `${Models.unlockedAchievements.tableName}.achievementId`,
      `${Models.achievements.tableName}.id`
    )
    .select(
      `${Models.achievements.tableName}.id`,
      `${Models.achievements.tableName}.name`
    )) as any) as { id: number; name: string }[];

  const resultAchievement = userUnlockedAchievements.filter(
    (ach) => ach.name === achName
  )[0];

  return { exists: !!resultAchievement, id: requiredAchievement.id };
};

export const checkAchievements = async (userId: number) => {
  const userOrderedGames = await OrderedGame.query().where("userId", userId);
  const userOrdersIds = userOrderedGames.map((el) => el.orderId);
  const userOrderedGamesIds = userOrderedGames.map((el) => el.gameId);
  const userGames = await Game.query().whereIn("id", userOrderedGamesIds);

  const userOrders = await Order.query().whereIn("id", userOrdersIds);

  const userPhysicalGamesIds = userOrderedGames
    .filter((el) => el.isPhysical)
    .map((el) => el.gameId);

  // Buy N games achievements

  if (userGames.length >= 1) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 1 game");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userGames.length >= 2) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 2 games");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userGames.length >= 10) {
    const achievement = await doesUserHaveAchievement(userId, "Buy 10 games");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }

  // Make N orders achievements

  if (userOrders.length >= 1) {
    const achievement = await doesUserHaveAchievement(userId, "Make 1 order");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userOrders.length >= 2) {
    const achievement = await doesUserHaveAchievement(userId, "Make 2 orders");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userOrders.length >= 10) {
    const achievement = await doesUserHaveAchievement(userId, "Make 10 orders");
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }

  // Order N phydical copies achievements

  if (userPhysicalGamesIds.length >= 1) {
    const achievement = await doesUserHaveAchievement(
      userId,
      "Order 1 physical copy"
    );
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userPhysicalGamesIds.length >= 2) {
    const achievement = await doesUserHaveAchievement(
      userId,
      "Order 2 physical copies"
    );
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
  if (userPhysicalGamesIds.length >= 10) {
    const achievement = await doesUserHaveAchievement(
      userId,
      "Order 10 physical copies"
    );
    if (!achievement.exists) {
      await UnlockedAchievement.query().insert({
        userId,
        achievementId: achievement.id,
        seen: false,
      });
    }
  }
};

export const loadImageToHost: (
  baseString: string
) => Promise<{ error: string | null; imageUrl: string }> = async (
  baseString
) => {
  const formData = new FormData();

  formData.append("key", process.env.IMAGE_HOST_API_KEY as string);
  formData.append("source", baseString.slice(baseString.indexOf(",") + 1));
  formData.append("format", "json");

  try {
    const imageObj = (await axios({
      url: "https://freeimage.host/api/1/upload",
      method: "POST",
      data: formData,
      headers: formData.getHeaders(),
    })) as any;

    const imageUrl = imageObj.data.image.url;

    return { error: null, imageUrl };
  } catch (e) {
    return { error: e.toString(), imageUrl: "" };
  }
};
