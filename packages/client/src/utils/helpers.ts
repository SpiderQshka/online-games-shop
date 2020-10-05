import { IGameCreator } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import _ from "lodash";

export const setUserSessionData = (gamesIds: number[]) =>
  localStorage.setItem("gamesIds", JSON.stringify(gamesIds));

export const getUserSessionData = (): number[] =>
  JSON.parse(localStorage.getItem("gamesIds") as string)
    ? JSON.parse(localStorage.getItem("gamesIds") as string)
    : [];

export const getAuthToken = () => localStorage.getItem("token");

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

export const sortGames = (
  games: IGameForUI[],
  sortBy: "creationDate" | "alphabet"
) => {
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
    return {};
  }, {} as any);
