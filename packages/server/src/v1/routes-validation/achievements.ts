import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IAchievementsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const achievementsRoutesValidation: IAchievementsRoutesValidation = {
  post: {
    name: Joi.string().min(3).required(),
  },
  put: {
    name: Joi.string().min(3).required(),
  },
};
