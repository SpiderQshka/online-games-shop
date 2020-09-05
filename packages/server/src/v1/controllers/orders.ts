import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { verifyJwtToken } from "v1/auth";

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

    const doesOrderRelateToUser = await OrderedGame.doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToUser && !user.isAdmin)
      ctx.throw(401, "Access denied");

    const response = await Order.get(ctx);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Order.getAll(ctx);

    ctx.body = response;
  },
  put: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToUser = await OrderedGame.doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    const response = await Order.put(ctx);

    ctx.body = response;
  },
  post: async (ctx) => {
    const orderedGames = await Order.create(ctx);

    ctx.body = orderedGames;
  },
  delete: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToUser = await OrderedGame.doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    const response = await Order.delete(ctx);

    ctx.body = `${response} rows deleted`;
  },
};
