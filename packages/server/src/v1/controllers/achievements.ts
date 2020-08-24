import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { v4 } from "uuid";
import { Achievement } from "../../models/Achievement";

Model.knex(knex);

interface IAchievementsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const achievementsController: IAchievementsController = {
  get: async (ctx) => {
    const result = await Achievement.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await Achievement.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await Achievement.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await Achievement.query().insert({
      id: v4(),
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await Achievement.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
