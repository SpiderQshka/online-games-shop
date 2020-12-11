import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Discount } from "models/Discount";
import { UsedDiscount } from "models/UsedDiscount";

Model.knex(knex);

interface IDiscountsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const discountsController: IDiscountsController = {
  get: async (ctx) => {
    const response = await Discount.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Discount with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Discount.query();

    if (!response) ctx.throw(404, `No discounts found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    const gamesIds = ctx.request.body.gamesIds as number[];
    delete ctx.request.body.gamesIds;

    const discount = await Discount.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!discount)
      ctx.throw(404, `Discount with id '${ctx.params.id}' was not found`);

    await UsedDiscount.query().delete().where("discountId", discount.id);

    const usedDiscountsToInsert = gamesIds.map((gameId) => ({
      discountId: discount.id,
      gameId,
    }));

    await UsedDiscount.query().insert(usedDiscountsToInsert);

    ctx.body = discount;
  },
  post: async (ctx) => {
    const gamesIds = ctx.request.body.gamesIds as number[];
    delete ctx.request.body.gamesIds;

    const discount = await Discount.query().insert(ctx.request.body);

    const usedDiscountsToInsert = gamesIds.map((gameId) => ({
      discountId: discount.id,
      gameId,
    }));

    await UsedDiscount.query().insert(usedDiscountsToInsert);

    ctx.body = discount;
  },
};
