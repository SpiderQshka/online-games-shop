import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { OrderedGame } from "models/OrderedGame";
import { verifyJwtToken } from "../auth";

Model.knex(knex);

interface IOrderedGamesController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
}

export const orderedGamesController: IOrderedGamesController = {
  get: async (ctx) => {
    const response = await OrderedGame.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Ordered game with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await OrderedGame.query();

    if (!response) ctx.throw(404, `No ordered games found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const orderedGames = await OrderedGame.query().where("userId", user.id);

    if (!orderedGames)
      ctx.throw(
        404,
        `Ordered games for user with id '${user.id}' were not found`
      );

    ctx.body = orderedGames;
  },
  put: async (ctx) => {
    const response = await OrderedGame.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!response)
      ctx.throw(404, `Ordered game with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    const response = await OrderedGame.query().insert(ctx.request.body);

    ctx.body = response;
  },
};
