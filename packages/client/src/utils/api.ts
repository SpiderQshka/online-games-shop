import axios from "axios";
import { config } from "config";
import { IOrder } from "interfaces/api";
import { IApi } from "context/api";

import { getTokenFromLocalStorage } from "./helpers";

export const API: IApi = {
  postOrder: (order: IOrder) =>
    axios
      .post(`${config.apiUrl}/orders`, order, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { order: response.data };
      })
      .catch((error) => {
        return {
          order: null,
          error: {
            msg: error.request.response,
            status: error.request.status || 500,
            resource: "orders",
          },
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
          error: {
            msg: error.request.response,
            status: error.request.status || 500,
            resource: "auth",
          },
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
          error: {
            msg: error.request.response,
            status: error.request.status || 500,
            resource: "auth",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "gameCreators",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "gameCreators",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "discounts",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "usedDiscounts",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "genres",
          },
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
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "usedGenres",
          },
        };
      }),
  getUserOrders: () =>
    axios
      .get(`${config.apiUrl}/my/orders`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { orders: response.data };
      })
      .catch((error) => {
        return {
          orders: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orders",
          },
        };
      }),
  getUserOrderedGames: () =>
    axios
      .get(`${config.apiUrl}/my/orderedGames`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { orderedGames: response.data };
      })
      .catch((error) => {
        return {
          orderedGames: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orderedGames",
          },
        };
      }),
  getUserAchievements: () =>
    axios
      .get(`${config.apiUrl}/my/achievements`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { achievements: response.data };
      })
      .catch((error) => {
        return {
          achievements: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "achievements",
          },
        };
      }),
  getUser: () =>
    axios
      .get(`${config.apiUrl}/my/users`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { user: response.data };
      })
      .catch((error) => {
        return {
          user: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "auth",
          },
        };
      }),
  getOrders: () =>
    axios
      .get(`${config.apiUrl}/orders`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { orders: response.data };
      })
      .catch((error) => {
        return {
          orders: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orders",
          },
        };
      }),
  getOrderedGames: () =>
    axios
      .get(`${config.apiUrl}/orderedGames`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { orderedGames: response.data };
      })
      .catch((error) => {
        return {
          orderedGames: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orderedGames",
          },
        };
      }),
  putOrder: (id, order) =>
    axios
      .put(`${config.apiUrl}/orders/${id}`, order, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      })
      .then((response) => {
        return { order: response.data };
      })
      .catch((error) => {
        return {
          order: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orders",
          },
        };
      }),
  postOrderAdmin: (order) =>
    axios
      .post(`${config.apiUrl}/admin/orders`, order, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { order: response.data };
      })
      .catch((error) => {
        return {
          order: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "orders",
          },
        };
      }),
  getUsers: () =>
    axios
      .get(`${config.apiUrl}/users`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { users: response.data };
      })
      .catch((error) => {
        return {
          users: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "users",
          },
        };
      }),
  postGame: (game) =>
    axios
      .post(`${config.apiUrl}/games`, game, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { game: response.data };
      })
      .catch((error) => {
        return {
          game: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
  putGame: (id, game) =>
    axios
      .put(`${config.apiUrl}/games/${id}`, game, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { game: response.data };
      })
      .catch((error) => {
        return {
          game: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
  postGameCreator: (gameCreator) =>
    axios
      .post(`${config.apiUrl}/gameCreators`, gameCreator, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { gameCreator: response.data };
      })
      .catch((error) => {
        return {
          gameCreator: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "gameCreators",
          },
        };
      }),
  putGameCreator: (id, gameCreator) =>
    axios
      .put(`${config.apiUrl}/gameCreators/${id}`, gameCreator, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { gameCreator: response.data };
      })
      .catch((error) => {
        return {
          gameCreator: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "gameCreators",
          },
        };
      }),
  getAchievements: () =>
    axios
      .get(`${config.apiUrl}/achievements`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { achievements: response.data };
      })
      .catch((error) => {
        return {
          achievements: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "achievements",
          },
        };
      }),
  postAchievement: (achievement) =>
    axios
      .post(`${config.apiUrl}/achievements`, achievement, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { achievement: response.data };
      })
      .catch((error) => {
        return {
          achievement: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "achievements",
          },
        };
      }),
  putAchievement: (id, achievement) =>
    axios
      .put(`${config.apiUrl}/achievements/${id}`, achievement, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { achievement: response.data };
      })
      .catch((error) => {
        return {
          achievement: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "achievements",
          },
        };
      }),
  postDiscount: (discount) =>
    axios
      .post(`${config.apiUrl}/discounts`, discount, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { discount: response.data };
      })
      .catch((error) => {
        return {
          discount: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "discounts",
          },
        };
      }),
  putDiscount: (id, discount) =>
    axios
      .put(`${config.apiUrl}/discounts/${id}`, discount, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { discount: response.data };
      })
      .catch((error) => {
        return {
          discount: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "discounts",
          },
        };
      }),
  postGenre: (genre) =>
    axios
      .post(`${config.apiUrl}/genres`, genre, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { genre: response.data };
      })
      .catch((error) => {
        return {
          genre: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "genres",
          },
        };
      }),
  putGenre: (id, genre) =>
    axios
      .put(`${config.apiUrl}/genres/${id}`, genre, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { genre: response.data };
      })
      .catch((error) => {
        return {
          genre: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "genres",
          },
        };
      }),
  blockGame: (gameId) =>
    axios
      .post(
        `${config.apiUrl}/games/block`,
        { gameId },
        {
          headers: {
            token: getTokenFromLocalStorage(),
          },
        }
      )
      .then((response) => {
        return { game: response.data };
      })
      .catch((error) => {
        return {
          game: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
  unblockGame: (gameId) =>
    axios
      .post(
        `${config.apiUrl}/games/unblock`,
        { gameId },
        {
          headers: {
            token: getTokenFromLocalStorage(),
          },
        }
      )
      .then((response) => {
        return { game: response.data };
      })
      .catch((error) => {
        return {
          game: null,
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
  getUserGames: () =>
    axios
      .get(`${config.apiUrl}/my/games`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { games: response.data };
      })
      .catch((error) => {
        return {
          games: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
  queryGame: (query: string) =>
    axios
      .get(`${config.apiUrl}/games/query/${query}`, {
        headers: {
          token: getTokenFromLocalStorage(),
        },
      })
      .then((response) => {
        return { games: response.data };
      })
      .catch((error) => {
        return {
          games: [],
          error: {
            msg: error.request.response || "Network error",
            status: error.request.status || 500,
            resource: "games",
          },
        };
      }),
};
