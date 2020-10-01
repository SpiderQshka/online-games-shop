import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Game } from "models/Game";
import _ from "lodash";
import Aigle from "aigle";
import { UsedGenre } from "models/UsedGenre";

Aigle.mixin(_, {});

Model.knex(knex);

interface IGamesController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const gamesController: IGamesController = {
  get: async (ctx) => {
    try {
      const response = await Game.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await Game.query();

    if (!response) ctx.throw(404, `No games found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const genresIds = [...ctx.request.body.genresIds] as number[];

      delete ctx.request.body.genresIds;

      const game = await Game.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      // Aigle.map(genresIds, (id) => UsedGenre.query().patchAndFetchById(id, ))

      console.log(game);

      if (!game) ctx.throw(404);

      ctx.body = game;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const genresIds = [...ctx.request.body.genresIds] as number[];

      delete ctx.request.body.genresIds;

      const game = await Game.query().insert(ctx.request.body);

      Aigle.map(genresIds, (genreId) =>
        UsedGenre.query().insert({
          gameId: game.id,
          genreId: genreId,
        })
      );

      ctx.body = game;
    } catch (e) {
      console.log(e);

      ctx.throw(400, "Bad request");
    }
  },
};
