import koaRouter from "koa-joi-router";
import * as JoiNamespace from "joi";
const Joi = koaRouter.Joi;

interface IUsedGenresRoutesValidation {
  post: JoiNamespace.SchemaLike;
  put: JoiNamespace.SchemaLike;
}

export const usedGenresRoutesValidation: IUsedGenresRoutesValidation = {
  post: {
    genreId: Joi.string().guid().required(),
    gameId: Joi.string().guid().required(),
  },
  put: {
    genreId: Joi.string().guid(),
    gameId: Joi.string().guid(),
  },
};
