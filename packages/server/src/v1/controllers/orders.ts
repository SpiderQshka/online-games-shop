import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { verifyJwtToken } from "v1/auth";
import { doesOrderRelateToUser } from "models/helpers";
import { IOrderedGame, IGame, IOrder } from "models/types";
import { Game } from "models/Game";
import _ from "lodash";
import Aigle from "aigle";

Aigle.mixin(_, {});

Model.knex(knex);

interface IOrdersController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
  postAdmin: Middleware;
}

export const ordersController: IOrdersController = {
  get: async (ctx) => {
    const user = verifyJwtToken(ctx);
    try {
      const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
        ctx.params.id,
        user.id
      );

      if (!doesOrderRelateToCurrrentUser && !user.isAdmin) ctx.throw(403);

      const response = await Order.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

        case 401:
          ctx.throw(403, "Access denied");

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await Order.query();
    if (!response) ctx.throw(404, `No orders found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    try {
      const orderedGames = await OrderedGame.query().where("userId", user.id);
      const ordersIds = [...new Set(orderedGames.map((el) => el.orderId))];

      const orders = await Aigle.map(ordersIds, (gameId: number) =>
        Order.query().findById(gameId)
      );

      if (!orders) ctx.throw(404);

      ctx.body = orders;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Orders for user with id '${user.id}' were not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  put: async (ctx) => {
    const user = verifyJwtToken(ctx);
    try {
      const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
        ctx.params.id,
        user.id
      );

      if (!doesOrderRelateToCurrrentUser && !user.isAdmin) ctx.throw(403);

      const gamesIds = ctx.request.body.gamesIds as number[];

      const games: IGame[] = await Aigle.map(gamesIds, (id) =>
        Game.query().findById(id)
      );

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      const updatedOrder = {
        price,
        status: ctx.request.body.status,
      };

      const order = await Order.query().patchAndFetchById(
        ctx.params.id,
        games.length > 0 ? updatedOrder : {}
      );

      const userId = (await OrderedGame.query().where("orderId", order.id))[0]
        .userId;

      await OrderedGame.query().delete().where("orderId", order.id);

      const orderedGames = await Aigle.map(games, (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          price,
          userId,
        })
      );
      ctx.body = orderedGames;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

        case 401:
          ctx.throw(403, "Access denied");

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    const user = verifyJwtToken(ctx);

    try {
      const gamesIds: number[] = [...ctx.request.body.gamesIds];

      const games: IGame[] = _.uniqBy(
        await Aigle.map(gamesIds, (id) => Game.query().findById(id)),
        (game: IGame) => game.id
      );

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      const order = await Order.query().insert({
        createdAt: new Date(),
        price,
        status: ctx.request.body.status,
      });

      const orderedGames: IOrderedGame[] = await Aigle.map(games, (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId: user.id,
          price: +game.price,
        })
      );
      ctx.body = { ...order, orderedGames };
    } catch (e) {
      console.log(e);

      ctx.throw(400, "Bad request");
    }
  },
  postAdmin: async (ctx) => {
    try {
      const gamesIds: number[] = ctx.request.body.gamesIds;
      const userId = ctx.request.body.userId;

      const games: IGame[] = _.uniqBy(
        await Aigle.map(gamesIds, (id) => Game.query().findById(id)),
        (game: IGame) => game.id
      );

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      const order = await Order.query().insert({
        createdAt: new Date(),
        price,
        status: ctx.request.body.status,
      });

      const orderedGames: IOrderedGame[] = await Aigle.map(
        games,
        async (game) =>
          await OrderedGame.query().insert({
            gameId: game.id,
            orderId: order.id,
            userId,
            price: +game.price,
          })
      );
      ctx.body = { ...order, orderedGames };
    } catch (e) {
      console.log(e);

      ctx.throw(400, "Bad request");
    }
  },
};
