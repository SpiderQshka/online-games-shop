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
  block: Middleware;
  unblock: Middleware;
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

      if (!game) ctx.throw(404);

      const usedGenres = await UsedGenre.query();

      const gameGenresIds =
        usedGenres.length > 0
          ? _.uniq(
              usedGenres
                .filter((usedGenre) => usedGenre.gameId === game.id)
                .map((usedGenre) => usedGenre.genreId)
            )
          : [];

      await Aigle.map(gameGenresIds, (genreId) =>
        UsedGenre.query()
          .delete()
          .where("genreId", genreId)
          .where("gameId", game.id)
      );

      await Aigle.map(genresIds, (genreId) =>
        UsedGenre.query().insert({ gameId: game.id, genreId })
      );

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

      await Aigle.map(genresIds, (genreId) =>
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
  block: async (ctx) => {
    try {
      const gameId = ctx.request.body.gameId as number;

      const game = await Game.query().findById(gameId);
      if (game.numberOfPhysicalCopies === 0) ctx.throw(400);

      const updatedGame = await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies - 1,
      });

      ctx.body = updatedGame;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  unblock: async (ctx) => {
    try {
      const gameId = ctx.request.body.gameId as number;

      const game = await Game.query().findById(gameId);

      const updatedGame = await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies + 1,
      });

      ctx.body = updatedGame;
    } catch (e) {
      switch (e.status) {
        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
};
