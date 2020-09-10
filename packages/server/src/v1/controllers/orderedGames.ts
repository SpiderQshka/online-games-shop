import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { OrderedGame } from "models/OrderedGame";

Model.knex(knex);

interface IOrderedGamesController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const orderedGamesController: IOrderedGamesController = {
  get: async (ctx) => {
    try {
      const response = await OrderedGame.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Ordered game with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await OrderedGame.query();

    if (!response) ctx.throw(404, `No ordered games found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const response = await OrderedGame.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Ordered game with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const response = await OrderedGame.query().insert(ctx.request.body);

      ctx.body = response;
    } catch (e) {
      ctx.throw(400, "Bad request");
    }
  },
};
