import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Achievement } from "models/Achievement";
import { verifyJwtToken } from "v1/auth";
import { UnlockedAchievement } from "models/UnlockedAchievement";
import _ from "lodash";
import Aigle from "aigle";

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

    const userAchievementsIds = (
      await UnlockedAchievement.query().where("userId", user.id)
    ).map((el) => el.achievementId);

    const userAchievements = await Aigle.map(
      userAchievementsIds,
      (achId: number) => Achievement.query().findById(achId)
    );

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
