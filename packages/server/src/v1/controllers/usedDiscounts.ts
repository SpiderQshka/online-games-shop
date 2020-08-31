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
  delete: Middleware;
}

export const usedDiscountsController: IUsedDiscountsController = {
  get: async (ctx) => {
    let response;

    try {
      response = await UsedDiscount.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Used discount with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    let response;

    try {
      response = await UsedDiscount.query();
    } catch (e) {
      ctx.throw(500, "Server error", { ...e });
    }

    if (!response) ctx.throw(404, `No used discounts found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    let response;

    try {
      response = await UsedDiscount.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Used discount with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    let response;

    try {
      response = await UsedDiscount.query().insert(ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = response;
  },
  delete: async (ctx) => {
    let response;

    try {
      response = await UsedDiscount.query().deleteById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Used discount with id '${ctx.params.id}' was not found`);

    ctx.body = `${response} rows deleted`;
  },
};
