import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { GameCreator } from "models/GameCreator";
import axios from "axios";

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
    const response = await GameCreator.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!response)
      ctx.throw(404, `Game creator with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    // try {
    //   const logoString = ctx.request.body.logo as string;
    //   const logoLink = await axios.post("https://api.imgbb.com/1/upload", {
    //     key: process.env.IMGBB_API_KEY,
    //     image: logoString,
    //   });
    //   console.log(logoLink);
    // } catch (e) {
    //   console.log(e);
    // }

    const response = await GameCreator.query().insert(ctx.request.body);

    ctx.body = response;
  },
};
