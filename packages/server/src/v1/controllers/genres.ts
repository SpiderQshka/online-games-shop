import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Genre } from "models/Genre";

Model.knex(knex);

interface IGenresController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const genresController: IGenresController = {
  get: async (ctx) => {
    const result = await Genre.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await Genre.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await Genre.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await Genre.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await Genre.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
