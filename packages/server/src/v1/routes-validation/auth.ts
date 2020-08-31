import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IAuthRoutesValidation {
  post: JoiNamespace.SchemaLike;
}

export const authRoutesValidation: IAuthRoutesValidation = {
  post: {
    login: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  },
};
