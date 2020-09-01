import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { Discount } from "../../models/Discount";

Model.knex(knex);

interface IDiscountsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const discountsController: IDiscountsController = {
  get: async (ctx) => {
    const result = await Discount.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await Discount.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await Discount.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await Discount.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await Discount.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
