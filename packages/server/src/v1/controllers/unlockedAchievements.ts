import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { UnlockedAchievement } from "models/UnlockedAchievement";

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
    let response;

    try {
      response = await UnlockedAchievement.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(
        404,
        `Unlocked achievement with id '${ctx.params.id}' was not found`
      );

    ctx.body = response;
  },
  getAll: async (ctx) => {
    let response;

    try {
      response = await UnlockedAchievement.query();
    } catch (e) {
      ctx.throw(500, "Server error", { ...e });
    }

    if (!response) ctx.throw(404, `No unlocked achievements found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    let response;

    try {
      response = await UnlockedAchievement.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(
        404,
        `Unlocked achievement with id '${ctx.params.id}' was not found`
      );

    ctx.body = response;
  },
  post: async (ctx) => {
    let response;

    try {
      response = await UnlockedAchievement.query().insert(ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    ctx.body = response;
  },
  delete: async (ctx) => {
    let response;

    try {
      response = await UnlockedAchievement.query().deleteById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(
        404,
        `Unlocked ahievement with id '${ctx.params.id}' was not found`
      );

    ctx.body = `${response} rows deleted`;
  },
};
