import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { GameCreator } from "models/GameCreator";
import axios from "axios";
import FormData from "form-data";

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
    const logoString = ctx.request.body.logo as string;
    const formData = new FormData();

    formData.append("key", process.env.IMAGE_HOST_API_KEY as string);
    formData.append("source", logoString.slice(logoString.indexOf(",") + 1));
    formData.append("format", "json");

    const logoObj = (await axios({
      url: "https://freeimage.host/api/1/upload",
      method: "POST",
      data: formData,
      headers: formData.getHeaders(),
    })) as any;

    const logo = logoObj.data.image.url;

    const response = await GameCreator.query().insert({
      ...ctx.request.body,
      logo,
    });

    ctx.body = response;
  },
};
