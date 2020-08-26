import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { v4 } from "uuid";
import { UnlockedAchievement } from "../../models/UnlockedAchievement";

Model.knex(knex);

interface IUnlockedAchievementsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const unlockedAchievementsController: IUnlockedAchievementsController = {
  get: async (ctx) => {
    const result = await UnlockedAchievement.query().findById(ctx.params.id);

    ctx.body = result;
  },
  getAll: async (ctx) => {
    const result = await UnlockedAchievement.query();

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await UnlockedAchievement.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await UnlockedAchievement.query().insert({
      id: v4(),
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await UnlockedAchievement.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
