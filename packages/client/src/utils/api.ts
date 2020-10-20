import axios from "axios";
import { config } from "config";
import { IOrder, IApi } from "interfaces/api";

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
          token: getTokenFromLocalStorage(),
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
          token: getTokenFromLocalStorage(),
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
          token: getTokenFromLocalStorage(),
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
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
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
};
