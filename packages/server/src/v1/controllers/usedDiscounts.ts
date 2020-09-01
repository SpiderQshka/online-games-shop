import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { UsedDiscount } from "../../models/UsedDiscount";

Model.knex(knex);

interface IUsedDiscountsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const usedDiscountsController: IUsedDiscountsController = {
  get: async (ctx) => {
    const result = await UsedDiscount.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await UsedDiscount.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await UsedDiscount.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await UsedDiscount.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await UsedDiscount.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
