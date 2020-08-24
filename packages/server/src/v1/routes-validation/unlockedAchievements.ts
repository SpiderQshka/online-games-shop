import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IUnlockedAchievementsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const unlockedAchievementsRoutesValidation: IUnlockedAchievementsRoutesValidation = {
  post: {
    userId: Joi.string().guid().required(),
    achievementId: Joi.string().guid().required(),
  },
  put: {
    userId: Joi.string().guid(),
    achievementId: Joi.string().guid(),
  },
};
