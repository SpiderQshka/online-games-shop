import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IDiscountsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const discountsRoutesValidation: IDiscountsRoutesValidation = {
  post: {
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
    amount: Joi.number().min(1).required(),
    type: Joi.string().allow(["%", "$"]).required(),
    gamesIds: Joi.array().items(Joi.number().min(0).required()).required(),
  },
  put: {
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")),
    amount: Joi.number().min(1).required(),
    type: Joi.string().allow(["%", "$"]).required(),
    gamesIds: Joi.array().items(Joi.number().min(0).required()).required(),
  },
};
