import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Achievement } from "models/Achievement";
import { verifyJwtToken } from "v1/auth";
import { UnlockedAchievement } from "models/UnlockedAchievement";
import _ from "lodash";
import Aigle from "aigle";
import { Models } from "models";

Aigle.mixin(_, {});

Model.knex(knex);

interface IAchievementsController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
}

export const achievementsController: IAchievementsController = {
  get: async (ctx) => {
    const response = await Achievement.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Achievement with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Achievement.query();

    if (!response) ctx.throw(404, `No achievements found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const userAchievements = await UnlockedAchievement.query()
      .where("userId", user.id)
      .join(
        Models.achievements.tableName,
        `${Models.unlockedAchievements.tableName}.achievementId`,
        `${Models.achievements.tableName}.id`
      )
      .select(
        `${Models.unlockedAchievements.tableName}.seen`,
        `${Models.achievements.tableName}.id`,
        `${Models.achievements.tableName}.name`,
        `${Models.achievements.tableName}.discount`
      );

    await UnlockedAchievement.query()
      .where("userId", user.id)
      .update({ seen: true });

    ctx.body = userAchievements;
  },
  put: async (ctx) => {
    const response = await Achievement.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!response)
      ctx.throw(404, `Achievement with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    const response = await Achievement.query().insert(ctx.request.body);

    ctx.body = response;
  },
};
