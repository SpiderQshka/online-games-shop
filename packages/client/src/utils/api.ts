import axios from "axios";
import { config } from "config";
import { IOrder, IApi, IOrderFromApi, IGameCreator } from "interfaces/api";
import { IStoreGame } from "interfaces/app";

import _ from "lodash";

export const API: IApi = {
  postOrder: (order: IOrder) =>
    axios
      .post(`${config.apiUrl}/orders`, order)
      .then((response) => {
        return { response: {} as IOrderFromApi };
      })
      .catch((error) => {
        return {
          response: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  login: (data) =>
    axios
      .post(`${config.apiUrl}/login`, data)
      .then((response) => {
        return { token: response.data.token };
      })
      .catch((error) => {
        return {
          token: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  register: (data) =>
    axios
      .post(`${config.apiUrl}/users`, {
        login: data.login,
        password: data.password,
      })
      .then((response) => {
        return { token: response.data.token };
      })
      .catch((error) => {
        return {
          token: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getGames: () =>
    axios
      .get(`${config.apiUrl}/games`)
      .then((response) => {
        return { games: response.data };
      })
      .catch((error) => {
        return {
          games: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getGame: (id: number) =>
    axios
      .get(`${config.apiUrl}/games/${id}`)
      .then((response) => {
        return { game: response.data };
      })
      .catch((error) => {
        return {
          game: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),

  getGameCreators: () =>
    axios
      .get(`${config.apiUrl}/gameCreators`)
      .then((response) => {
        return { gameCreators: response.data };
      })
      .catch((error) => {
        return {
          gameCreators: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getGameCreator: (id: number) =>
    axios
      .get(`${config.apiUrl}/gameCreators/${id}`)
      .then((response) => {
        return { gameCreator: response.data };
      })
      .catch((error) => {
        return {
          gameCreator: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getDiscounts: () =>
    axios
      .get(`${config.apiUrl}/discounts`)
      .then((response) => {
        return { discounts: response.data };
      })
      .catch((error) => {
        return {
          discounts: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getUsedDiscounts: () =>
    axios
      .get(`${config.apiUrl}/usedDiscounts`)
      .then((response) => {
        return { usedDiscounts: response.data };
      })
      .catch((error) => {
        return {
          usedDiscounts: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getGenres: () =>
    axios
      .get(`${config.apiUrl}/genres`)
      .then((response) => {
        return { genres: response.data };
      })
      .catch((error) => {
        return {
          genres: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getUsedGenres: () =>
    axios
      .get(`${config.apiUrl}/usedGenres`)
      .then((response) => {
        return { usedGenres: response.data };
      })
      .catch((error) => {
        return {
          usedGenres: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getUserOrders: () =>
    axios
      .get(`${config.apiUrl}/my/orders`, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return { orders: response.data };
      })
      .catch((error) => {
        return {
          orders: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getUserOrderedGames: () =>
    axios
      .get(`${config.apiUrl}/my/orderedGames`, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return { orderedGames: response.data };
      })
      .catch((error) => {
        return {
          orderedGames: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
  getUserAchievements: () =>
    axios
      .get(`${config.apiUrl}/my/achievements`, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return { achievements: response.data };
      })
      .catch((error) => {
        return {
          achievements: [],
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
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

export const filterGames = (
  games: IStoreGame[],
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
  games: IStoreGame[],
  sortBy: "creationDate" | "alphabet"
) => {
  switch (sortBy) {
    case "creationDate":
      return [...games].sort(
        (prev, curr) =>
          new Date(prev.creationDate).getTime() -
          new Date(curr.creationDate).getTime()
      );

    case "alphabet":
      return [...games].sort((prev, curr) =>
        prev.name.localeCompare(curr.name)
      );
  }
};
