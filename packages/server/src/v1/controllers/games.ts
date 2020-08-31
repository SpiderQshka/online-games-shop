import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Game } from "models/Game";

Model.knex(knex);

interface IGamesController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const gamesController: IGamesController = {
  get: async (ctx) => {
    let response;

    try {
      response = await Game.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    let response;

    try {
      response = await Game.query();
    } catch (e) {
      ctx.throw(500, "Server error", { ...e });
    }

    if (!response) ctx.throw(404, `No games found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    let response;

    try {
      response = await Game.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    let response;

    try {
      response = await Game.query().insert(ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = response;
  },
  delete: async (ctx) => {
    let response;

    try {
      response = await Game.query().deleteById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

    ctx.body = `${response} rows deleted`;
  },
};
