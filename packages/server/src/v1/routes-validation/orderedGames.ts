import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IOrderedGamesRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const orderedGamesRoutesValidation: IOrderedGamesRoutesValidation = {
  post: {
    userId: Joi.string().guid().required(),
    orderId: Joi.string().guid().required(),
    gameId: Joi.string().guid().required(),
    price: Joi.number().min(0).required(),
  },
  put: {
    userId: Joi.string().guid(),
    orderId: Joi.string().guid(),
    gameId: Joi.string().guid(),
    price: Joi.number().min(0),
  },
};
