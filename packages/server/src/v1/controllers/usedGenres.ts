import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { UsedGenre } from "../../models/UsedGenre";

Model.knex(knex);

interface IUsedGenresController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const usedGenresController: IUsedGenresController = {
  get: async (ctx) => {
    const result = await UsedGenre.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await UsedGenre.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await UsedGenre.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await UsedGenre.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await UsedGenre.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
