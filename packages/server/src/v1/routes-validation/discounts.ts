import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IDiscountsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const discountsRoutesValidation: IDiscountsRoutesValidation = {
  post: {
    startDate: Joi.date().required(),
    duration: Joi.number().min(0).required(),
    amount: Joi.string().required(),
  },
  put: {
    startDate: Joi.date(),
    duration: Joi.number(),
    amount: Joi.string(),
  },
};
