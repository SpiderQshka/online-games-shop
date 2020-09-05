import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IOrdersRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const ordersRoutesValidation: IOrdersRoutesValidation = {
  post: {
    games: Joi.array().items(Joi.number().min(0).required()).required(),
  },
  put: {
    games: Joi.array().items(Joi.number().min(0).required()).required(),
  },
};
