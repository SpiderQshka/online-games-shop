import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { UsedDiscount } from "models/UsedDiscount";

Model.knex(knex);

interface IUsedDiscountsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const usedDiscountsController: IUsedDiscountsController = {
  get: async (ctx) => {
    try {
      const response = await UsedDiscount.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Used discount with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await UsedDiscount.query();

    if (!response) ctx.throw(404, `No used discounts found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const response = await UsedDiscount.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Used discount with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const response = await UsedDiscount.query().insert(ctx.request.body);

      ctx.body = response;
    } catch (e) {
      ctx.throw(400, "Bad request");
    }
  },
};
