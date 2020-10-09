import { Discount } from "models/Discount";
import { IGame } from "models/types";
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

export const getGamePriceWithDiscount = (
  game: IGame,
  discount: Discount | null,
  isPhysical: boolean
) => {
  return discount
    ? isPhysical
      ? discount.type === "%"
        ? Math.trunc(
            game.physicalCopyPrice *
              (discount ? (100 - discount.amount) / 100 : 1)
          )
        : Math.trunc(game.physicalCopyPrice - discount.amount)
      : discount.type === "%"
      ? Math.trunc(game.price * (discount ? (100 - discount.amount) / 100 : 1))
      : Math.trunc(game.price - discount.amount)
    : isPhysical
    ? game.physicalCopyPrice
    : game.price;
};
