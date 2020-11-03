import {
  IAchievementFromApi,
  IDiscount,
  IDiscountFromApi,
  IGameCreatorFromApi,
  IGameForOrder,
  IGameFromApi,
  IGenreFromApi,
  IMyGameFromApi,
  IOrderedGame,
  IOrderFromApi,
  IUsedDiscount,
  IUsedGenre,
} from "interfaces/api";
import { IGameForUI, IOrderForUI, IOrderWithUserId } from "interfaces/app";
import _ from "lodash";
import { IFilterConfig, SortType } from "pages/Store";

export const setCartData = (games: { id: number; isPhysical: boolean }[]) =>
  localStorage.setItem("games", JSON.stringify(games));

export const getCartData = (): { id: number; isPhysical: boolean }[] =>
  JSON.parse(localStorage.getItem("games") as string) || [];

export const removeCartData = () => localStorage.removeItem("games");

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const setTokenToLocalStorage = (token: string) =>
  localStorage.setItem("token", token);

export const removeTokenFromLocalStorage = () =>
  localStorage.removeItem("token");

export const filterGames = (games: IGameForUI[], config: IFilterConfig) =>
  games.filter((game) => {
    if (
      config.gameCreatorId !== null &&
      game.gameCreatorId !== config.gameCreatorId
    )
      return false;
    if (config.genresIds.length !== 0) {
      const gameGenresIds = game.genres.map((el) => el.id);
      if (
        !_.isEqual(
          _.intersection(gameGenresIds, config.genresIds),
          config.genresIds.sort()
        )
      )
        return false;
    }
    if (
      +game.optimalPrice < config.priceBounds.min ||
      +game.optimalPrice > config.priceBounds.max
    )
      return false;
    return true;
  });

export const sortGames = (games: IGameForUI[], sortBy: SortType) => {
  switch (sortBy) {
    case "creationDate":
      return [...games].sort(
        (prev, curr) =>
          new Date(prev.createdAt).getTime() -
          new Date(curr.createdAt).getTime()
      );

    case "alphabet":
      return [...games].sort((prev, curr) =>
        prev.name.localeCompare(curr.name)
      );
    case "discount":
      return [...games].sort((prev, curr) => {
        const prevDisountInPercents = prev.discount
          ? prev.discount?.type === "%"
            ? prev.discount?.amount
            : ((prev.price - (prev.price - prev.discount.amount)) /
                prev.price) *
              100
          : 0;
        const currDisountInPercents = curr.discount
          ? curr.discount?.type === "%"
            ? curr.discount?.amount
            : ((curr.price - (curr.price - curr.discount.amount)) /
                curr.price) *
              100
          : 0;
        return currDisountInPercents - prevDisountInPercents;
      });
  }
};

export const doesCurrentDateSuitDiscount = (
  discount: IDiscountFromApi | IDiscount
) => {
  return (
    !!discount.amount &&
    new Date(discount.startDate) < new Date() &&
    new Date(discount.endDate) > new Date()
  );
};

interface FormatGamesForUIConfig {
  games: IGameFromApi[];
  gameCreators: IGameCreatorFromApi[];
  usedGenres: IUsedGenre[];
  genres: IGenreFromApi[];
  usedDiscounts: IUsedDiscount[];
  discounts: IDiscountFromApi[];
  userAchievements: IAchievementFromApi[];
}

export const formatGamesForUI: (
  config: FormatGamesForUIConfig
) => IGameForUI[] = ({
  discounts,
  gameCreators,
  games,
  genres,
  usedDiscounts,
  usedGenres,
  userAchievements,
}) => {
  const achievementDiscount = getAchievementDiscountSize({ userAchievements });
  return games
    .map((game) => {
      const gameCreator = gameCreators.filter(
        (el) => el.id === game.gameCreatorId
      )[0];
      const gameGenresIds = [
        ...new Set(
          usedGenres
            .filter((el) => el.gameId === game.id)
            .map((el) => el.genreId)
        ),
      ];
      const gameGenres = genres.filter((genre) =>
        gameGenresIds.includes(genre.id)
      );
      const gameDiscountsIds = usedDiscounts
        .filter((el) => el.gameId === game.id)
        .map((el) => el.discountId);
      const gameHightestDiscount = getGameHightestDiscount({
        game,
        discounts,
        gameDiscountsIds,
      });
      return {
        ...game,
        gameCreator,
        genres: gameGenres,
        discount:
          gameHightestDiscount &&
          doesCurrentDateSuitDiscount(gameHightestDiscount)
            ? gameHightestDiscount
            : null,
      };
    })
    .map((game) => ({
      ...game,
      optimalPrice: getOptimalGamePrice({
        achievementDiscount,
        game: {
          ...game,
          optimalPrice: game.price,
          physicalCopyOptimalPrice: game.physicalCopyPrice,
        },
      }),
      physicalCopyOptimalPrice: getOptimalGamePrice({
        achievementDiscount,
        game: {
          ...game,
          optimalPrice: game.price,
          physicalCopyOptimalPrice: game.physicalCopyPrice,
        },
        isPhysical: true,
      }),
    }));
};

interface FormatOrdersForUIConfig {
  orderedGames: IOrderedGame[];
  orders: IOrderFromApi[];
  userGames: IMyGameFromApi[];
  usedDiscounts: IUsedDiscount[];
  discounts: IDiscountFromApi[];
}

export const formatOrdersForUI: (
  config: FormatOrdersForUIConfig
) => IOrderWithUserId[] = ({
  orderedGames,
  orders,
  userGames,
  usedDiscounts,
  discounts,
}) =>
  orders.map((order) => {
    const gamesIds = orderedGames
      .filter((el) => +el.orderId === +order.id)
      .map((el) => el.gameId);
    const gamePhysicalDublicates: IGameForOrder[] = [];

    const gamesForOrder: IGameForOrder[] = userGames
      .filter((game) => gamesIds.includes(game.id))
      .map((game) => {
        const gameDiscountsIds = usedDiscounts
          .filter((el) => el.gameId === game?.id)
          .map((el) => el.discountId);

        const discount = getGameHightestDiscount({
          discounts,
          game,
          gameDiscountsIds,
        });
        return {
          ...game,
          isPhysical: game.isPhysical,
          discount,
        };
      });

    const userId = orderedGames.filter(
      (orderedGame) => orderedGame.orderId === order.id
    )[0].userId;
    return {
      ...order,
      orderedGames: gamesForOrder,
      userId,
    };
  });

export const getGameHightestDiscount: (config: {
  game: IGameFromApi;
  discounts: IDiscountFromApi[];
  gameDiscountsIds: number[];
}) => IDiscountFromApi | null = ({ discounts, game, gameDiscountsIds }) => {
  const discount = discounts
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
    }, {} as IDiscountFromApi);
  return discount.amount ? discount : null;
};

export const getAchievementDiscountSize: (config: {
  userAchievements: IAchievementFromApi[];
}) => number = ({ userAchievements }) =>
  userAchievements
    .map((el) => el.discount)
    .reduce((prev, curr) => prev + curr, 0);

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
  achievementDiscount: number;
  game: IGameForUI | IGameForOrder;
  isPhysical?: boolean;
}

export const getOptimalGamePrice = ({
  achievementDiscount,
  game,
  isPhysical,
}: IGetOptimalGamePrice) => {
  if (!isPhysical) {
    const gamePriceWithGameDiscount = game.discount
      ? getGamePriceWithDiscount({
          discountSize: game.discount.amount,
          discountType: game.discount.type,
          gamePrice: +game.price,
        })
      : +game.price;
    const gamePriceWithAchievement = getGamePriceWithDiscount({
      discountSize: achievementDiscount,
      gamePrice: game.price,
      discountType: "%",
    });

    return gamePriceWithAchievement < gamePriceWithGameDiscount
      ? +gamePriceWithAchievement.toFixed(2)
      : +gamePriceWithGameDiscount.toFixed(2);
  } else {
    const gamePriceWithGameDiscount = game.discount
      ? getGamePriceWithDiscount({
          discountSize: game.discount.amount,
          discountType: game.discount.type,
          gamePrice: +game.physicalCopyPrice,
        })
      : +game.physicalCopyPrice;
    const gamePriceWithAchievement = getGamePriceWithDiscount({
      discountSize: achievementDiscount,
      gamePrice: game.physicalCopyPrice,
      discountType: "%",
    });

    return gamePriceWithAchievement < gamePriceWithGameDiscount
      ? +gamePriceWithAchievement.toFixed(2)
      : +gamePriceWithGameDiscount.toFixed(2);
  }
};
