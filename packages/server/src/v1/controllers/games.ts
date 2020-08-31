import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { Game } from "../../models/Game";

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
    const result = await Game.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await Game.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await Game.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await Game.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await Game.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
