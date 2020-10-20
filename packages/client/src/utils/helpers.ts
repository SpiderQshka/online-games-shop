import {
  IDiscount,
  IDiscountFromApi,
  IGameCreator,
  IGameCreatorFromApi,
  IGameFromApi,
  IGenreFromApi,
  IUsedDiscount,
  IUsedGenre,
} from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import _ from "lodash";
import { SortType } from "pages/Store";

export const setUserSessionData = (
  games: { id: number; isPhysical: boolean }[]
) => localStorage.setItem("games", JSON.stringify(games));

export const getUserSessionData = (): { id: number; isPhysical: boolean }[] =>
  JSON.parse(localStorage.getItem("games") as string) || [];

export const removeUserSessionData = () => localStorage.removeItem("games");

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const setTokenToLocalStorage = (token: string) =>
  localStorage.setItem("token", token);

export const removeTokenFromLocalStorage = () =>
  localStorage.removeItem("token");

export const filterGames = (
  games: IGameForUI[],
  filterBy: {
    name?: string;
    ageRating?: number;
    price?: number;
    gameCreator?: IGameCreator;
    creationDate?: Date;
    genresIds?: number[];
  }
) =>
  games.filter((game: any) => {
    const anyFilteredBy = filterBy as any;

    for (let key in filterBy) {
      if (key === "genresIds") {
        const gameGenresIds = game.genres?.map((el: any) => el.id);
        if (
          !_.isEqual(
            _.intersection(gameGenresIds, filterBy.genresIds),
            filterBy.genresIds?.sort()
          )
        )
          return false;
      } else if (!_.isEqual(game[key], anyFilteredBy[key])) return false;
    }

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

export const getFilterOptions = (checkedFormInputs: HTMLInputElement[]) =>
  checkedFormInputs.reduce((prev, curr) => {
    switch (curr.type) {
      case "radio":
        return {
          ...prev,
          [curr.name]: +curr.value,
        };
      case "checkbox":
        return {
          ...prev,
          [curr.name]: prev[curr.name]
            ? [...prev[curr.name], +curr.value]
            : [+curr.value],
        };
    }
    const a = setTimeout(() => {}, 1);
    return {};
  }, {} as any);

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
}) =>
  games.map((game) => {
    const gameCreator = gameCreators.filter(
      (el) => el.id === game.gameCreatorId
    )[0];
    const gameGenresIds = [
      ...new Set(
        usedGenres.filter((el) => el.gameId === game.id).map((el) => el.genreId)
      ),
    ];
    const gameGenres = genres.filter((genre) =>
      gameGenresIds.includes(genre.id)
    );
    const gameDiscountsIds = usedDiscounts
      .filter((el) => el.gameId === game.id)
      .map((el) => el.discountId);
    const gameHightestDiscount = discounts
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
    return {
      ...game,
      gameCreator,
      genres: gameGenres,
      discount:
        gameHightestDiscount.amount &&
        doesCurrentDateSuitDiscount(gameHightestDiscount)
          ? gameHightestDiscount
          : null,
    };
  });

export const getGameHightestDiscount: (config: {
  game: IGameFromApi;
  discounts: IDiscountFromApi[];
  gameDiscountsIds: number[];
}) => IDiscountFromApi | null = ({ discounts, game, gameDiscountsIds }) =>
  game
    ? discounts
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
        }, {} as IDiscountFromApi)
    : null;
