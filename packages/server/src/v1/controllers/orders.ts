import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { verifyJwtToken } from "v1/auth";
import { doesOrderRelateToUser } from "models/helpers";
import { processArrayAsync, deleteRepeatedValuesFromArray } from "v1/helpers";
import { IOrder, IOrderedGame, IGame } from "models/types";
import { Game } from "models/Game";

Model.knex(knex);

interface IOrdersController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const ordersController: IOrdersController = {
  get: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToCurrrentUser && !user.isAdmin)
      ctx.throw(401, "Access denied");

    let response;

    try {
      response = await Order.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    let response;

    try {
      response = await Order.query();
    } catch (e) {
      ctx.throw(500, "Server error");
    }

    if (!response) ctx.throw(404, `No orders found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    const user = verifyJwtToken(ctx);
    const gamesIds = ctx.request.body.games as number[];
    let games: IGame[];
    let order: IOrder;
    let orderedGames: IOrderedGame[] = [];

    const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToCurrrentUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    let response;

    try {
      games = await processArrayAsync(
        gamesIds,
        async (id) => await Game.query().findById(id)
      );

      games = deleteRepeatedValuesFromArray(games);

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      order = await Order.query().updateAndFetchById(ctx.params.id, {
        price,
      });

      orderedGames = await processArrayAsync(games, async (game: IGame) => {
        const orderedGame = await OrderedGame.query()
          .where("orderId", order.id)
          .where("gameId", game.id)
          .where("userId", user.id)[0];

        return await OrderedGame.query().updateAndFetchById(orderedGame.id, {
          gameId: game.id,
          orderId: order.id,
          userId: user.id,
          price: game.price,
        });
      });
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = response;
  },
  post: async (ctx) => {
    const gamesIds = ctx.request.body.games as number[];
    let games: IGame[];
    let order: IOrder;
    let orderedGames: IOrderedGame[] = [];

    const user = verifyJwtToken(ctx);

    try {
      games = await processArrayAsync(
        gamesIds,
        async (id) => await Game.query().findById(id)
      );

      games = deleteRepeatedValuesFromArray(games);

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      order = await Order.query().insert({
        createdAt: new Date(),
        price,
      });

      orderedGames = await processArrayAsync(
        games,
        async (game) =>
          await OrderedGame.query().insert({
            gameId: game.id,
            orderId: order.id,
            userId: user.id,
            price: +game.price,
          })
      );
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = orderedGames;
  },
  delete: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToCurrentUser = doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToCurrentUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    let response;

    try {
      await OrderedGame.query().where("orderId", ctx.params.id).delete();
      response = await Order.query().deleteById(ctx.params.id);
    } catch (error) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    ctx.body = `${response} rows deleted`;
  },
};
