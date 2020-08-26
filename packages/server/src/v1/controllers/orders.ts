import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { v4 } from "uuid";
import { Order } from "../../models/Order";

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
    const result = await Order.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await Order.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await Order.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await Order.query().insert({
      id: v4(),
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await Order.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
