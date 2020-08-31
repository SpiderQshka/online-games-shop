import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Discount } from "models/Discount";

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
    let response;

    try {
      response = await Discount.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Discount with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    let response;

    try {
      response = await Discount.query();
    } catch (e) {
      ctx.throw(500, "Server error", { ...e });
    }

    if (!response) ctx.throw(404, `No discounts found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    let response;

    try {
      response = await Discount.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Discount with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    let response;

    try {
      response = await Discount.query().insert(ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = response;
  },
  delete: async (ctx) => {
    let response;

    try {
      response = await Discount.query().deleteById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Discount with id '${ctx.params.id}' was not found`);

    ctx.body = `${response} rows deleted`;
  },
};
