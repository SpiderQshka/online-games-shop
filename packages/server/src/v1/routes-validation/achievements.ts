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
    discount: Joi.number().min(0).max(100).required(),
  },
  put: {
    name: Joi.string().min(3),
    discount: Joi.number().min(0).max(100),
  },
};
