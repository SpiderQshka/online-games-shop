import axios from "axios";
import { config } from "config";
import { IOrder, IApi } from "interfaces/api";

import { getAuthToken } from "./helpers";

export const API: IApi = {
  postOrder: (order: IOrder) =>
    axios
      .post(`${config.apiUrl}/orders`, order, {
        headers: {
          token: getAuthToken(),
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
          token: getAuthToken(),
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
          token: getAuthToken(),
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
          token: getAuthToken(),
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
          token: getAuthToken(),
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
          token: getAuthToken(),
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
          token: getAuthToken(),
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
  putOrder: (order) =>
    axios
      .put(
        `${config.apiUrl}/orders/${order.id}`,
        { gamesIds: order.gamesIds, status: order.status },
        {
          headers: {
            token: getAuthToken(),
          },
        }
      )
      .then((response) => {
        return { order: response.data };
      })
      .catch((error) => {
        return {
          order: null,
          error: { msg: error.request.response, status: error.request.status },
        };
      }),
};
