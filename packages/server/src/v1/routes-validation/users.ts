import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IUsersRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const usersRoutesValidation: IUsersRoutesValidation = {
  post: {
    login: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  },
  put: {
    login: Joi.string().min(5),
    password: Joi.string().min(5),
  },
};
