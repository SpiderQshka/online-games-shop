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
}

export const genresController: IGenresController = {
  get: async (ctx) => {
    const response = await Genre.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Genre with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Genre.query();

    if (!response) ctx.throw(404, `No genres found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    const response = await Genre.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!response)
      ctx.throw(404, `Genre with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    const response = await Genre.query()
      .insert(ctx.request.body)
      .catch(() =>
        ctx.throw(400, "Error occured while loading genre to database")
      );

    ctx.body = response;
  },
};
