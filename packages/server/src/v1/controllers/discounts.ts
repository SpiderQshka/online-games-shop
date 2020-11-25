import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Discount } from "models/Discount";
import { UsedDiscount } from "models/UsedDiscount";
import Aigle from "aigle";

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

    await Aigle.map(gamesIds, (gameId) =>
      UsedDiscount.query().insert({ discountId: discount.id, gameId })
    );

    ctx.body = discount;
  },
  post: async (ctx) => {
    const gamesIds = ctx.request.body.gamesIds as number[];
    delete ctx.request.body.gamesIds;

    const discount = await Discount.query()
      .insert(ctx.request.body)
      .catch(() =>
        ctx.throw(400, "Error occured while loading discount to database")
      );

    await Aigle.map(gamesIds, (gameId) =>
      UsedDiscount.query().insert({ discountId: discount.id, gameId })
    ).catch(() =>
      ctx.throw(400, "Error occured while loading discount to database")
    );

    ctx.body = discount;
  },
};
