import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { GameCreator } from "models/GameCreator";

Model.knex(knex);

interface IGameCreatorsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const gameCreatorsController: IGameCreatorsController = {
  get: async (ctx) => {
    try {
      const response = await GameCreator.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Game creator with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await GameCreator.query();

    if (!response) ctx.throw(404, `No game creators found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const response = await GameCreator.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Game creator with id '${ctx.params.id}' was not found`
          );

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const response = await GameCreator.query().insert(ctx.request.body);

      ctx.body = response;
    } catch (e) {
      ctx.throw(400, "Bad request");
    }
  },
};
