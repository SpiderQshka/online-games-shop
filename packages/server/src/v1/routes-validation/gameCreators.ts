import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IGameCreatorsRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const gameCreatorsRoutesValidation: IGameCreatorsRoutesValidation = {
  post: {
    name: Joi.string().min(5).required(),
    logo: Joi.string().default(null),
    yearOfFoundation: Joi.number().min(0).required(),
  },
  put: {
    name: Joi.string().min(5),
    logo: Joi.string(),
    yearOfFoundation: Joi.number().min(0),
  },
};
