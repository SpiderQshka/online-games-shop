import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Achievement } from "models/Achievement";

Model.knex(knex);

interface IAchievementsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const achievementsController: IAchievementsController = {
  get: async (ctx) => {
    try {
      const response = await Achievement.query().findById(ctx.params.id);
      if (!response) ctx.throw(404);
      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Achievement with id '${ctx.params.id}' was not found`
          );
        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await Achievement.query();

    if (!response) ctx.throw(404, `No achievements found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const response = await Achievement.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(
            404,
            `Achievement with id '${ctx.params.id}' was not found`
          );
        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const response = await Achievement.query().insert(ctx.request.body);

      ctx.body = response;
    } catch (e) {
      ctx.throw(400, "Bad request");
    }
  },
};
