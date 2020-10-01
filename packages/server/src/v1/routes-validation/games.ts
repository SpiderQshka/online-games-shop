import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IGamesRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const gamesRoutesValidation: IGamesRoutesValidation = {
  post: {
    name: Joi.string().min(5).required(),
    logo: Joi.string().default(null),
    description: Joi.string().min(30).default(null),
    ageRating: Joi.number().min(0).max(18).default(null),
    price: Joi.number().min(0).required(),
    numberOfPhysicalCopies: Joi.number().min(0).default(0),
    gameCreatorId: Joi.number().required(),
    createdAt: Joi.date().iso().required(),
    genresIds: Joi.array().items(Joi.number().min(0).required()).required(),
  },
  put: {
    name: Joi.string().min(5),
    logo: Joi.string(),
    description: Joi.string().min(30),
    ageRating: Joi.number().min(0),
    price: Joi.number().min(0),
    numberOfPhysicalCopies: Joi.number().min(0).default(0),
    gameCreatorId: Joi.number(),
    createdAt: Joi.date().iso(),
    genresIds: Joi.array().items(Joi.number().min(0).required()),
  },
};
