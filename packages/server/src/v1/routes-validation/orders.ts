import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IOrdersRoutesValidation {
  post: JoiNamespace.SchemaLike;
  postAdmin: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const ordersRoutesValidation: IOrdersRoutesValidation = {
  post: {
    gamesIds: Joi.array().items(Joi.number().min(0).required()).required(),
    status: Joi.string().valid("pending", "cancelled", "received").required(),
  },
  postAdmin: {
    userId: Joi.number().min(1).required(),
    gamesIds: Joi.array().items(Joi.number().min(0).required()).required(),
    status: Joi.string().valid("pending", "cancelled", "received").required(),
  },
  put: {
    gamesIds: Joi.array().items(Joi.number().min(0).required()).required(),
    status: Joi.string().valid("pending", "cancelled", "received").required(),
  },
};
