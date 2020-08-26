import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IUsedDiscountsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const usedDiscountsRoutesValidation: IUsedDiscountsRoutesValidation = {
  post: {
    discountId: Joi.string().guid().required(),
    gameId: Joi.string().guid().required(),
  },
  put: {
    discountId: Joi.string().guid(),
    gameId: Joi.string().guid(),
  },
};
