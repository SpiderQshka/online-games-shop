import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { v4 } from "uuid";
import { OrderedGame } from "../../models/OrderedGame";

Model.knex(knex);

interface IOrderedGamesController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const orderedGamesController: IOrderedGamesController = {
  get: async (ctx) => {
    const result = await OrderedGame.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await OrderedGame.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await OrderedGame.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await OrderedGame.query().insert({
      id: v4(),
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await OrderedGame.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
