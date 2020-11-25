import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { GameCreator } from "models/GameCreator";
import { loadImageToHost } from "v1/helpers";

Model.knex(knex);

interface IGameCreatorsController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const gameCreatorsController: IGameCreatorsController = {
  get: async (ctx) => {
    const response = await GameCreator.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Game creator with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await GameCreator.query();

    if (!response) ctx.throw(404, `No game creators found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    const logoString = ctx.request.body.logo as string;
    const gameCreatorObj = ctx.request.body;

    if (logoString) {
      const { error, imageUrl } = await loadImageToHost(logoString);

      if (error)
        ctx.throw(500, "Error occured while loading game creator logo");
      else gameCreatorObj.logo = imageUrl;
    }

    const response = await GameCreator.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, gameCreatorObj);

    if (!response)
      ctx.throw(404, `Game creator with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    const logoString = ctx.request.body.logo as string;

    const { error, imageUrl } = await loadImageToHost(logoString);

    if (error) ctx.throw(500, "Error occured while loading game creator logo");

    const response = await GameCreator.query()
      .insert({
        ...ctx.request.body,
        logo: imageUrl,
      })
      .catch(() =>
        ctx.throw(
          400,
          "Error occured while inserting game creator object into database"
        )
      );

    ctx.body = response;
  },
};
