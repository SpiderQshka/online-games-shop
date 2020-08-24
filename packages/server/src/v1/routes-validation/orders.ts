import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IOrdersRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const ordersRoutesValidation: IOrdersRoutesValidation = {
  post: {
    createdAt: Joi.date().required(),
    price: Joi.number().min(0).required(),
  },
  put: {
    createdAt: Joi.date(),
    price: Joi.number().min(0),
  },
};
