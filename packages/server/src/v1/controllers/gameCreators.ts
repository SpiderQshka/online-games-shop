import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { GameCreator } from "../../models/GameCreator";

Model.knex(knex);

interface IGameCreatorsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const gameCreatorsController: IGameCreatorsController = {
  get: async (ctx) => {
    const result = await GameCreator.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await GameCreator.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await GameCreator.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await GameCreator.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await GameCreator.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
