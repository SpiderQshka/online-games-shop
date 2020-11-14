import { Middleware } from "koa";
import knex from "db/knex";
import { Model, raw } from "objection";
import { Game } from "models/Game";
import _ from "lodash";
import Aigle from "aigle";
import { UsedGenre } from "models/UsedGenre";
import { verifyJwtToken } from "v1/auth";
import { OrderedGame } from "models/OrderedGame";
import { checkAchievements, loadImageToHost } from "v1/helpers";

Aigle.mixin(_, {});

Model.knex(knex);

interface IGamesController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
  query: Middleware;
  block: Middleware;
  unblock: Middleware;
}

export const gamesController: IGamesController = {
  get: async (ctx) => {
    const response = await Game.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Game.query();

    if (!response) ctx.throw(404, `No games found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const myOrderedGames = await OrderedGame.query().where("userId", user.id);

    const myGames = await Aigle.map(myOrderedGames, async (el) => {
      const game = await Game.query().findById(el.gameId);
      return { ...game, isPhysical: el.isPhysical };
    });

    await checkAchievements(user.id);

    ctx.body = myGames;
  },
  put: async (ctx) => {
    const genresIds = [...ctx.request.body.genresIds] as number[];

    delete ctx.request.body.genresIds;

    const logoString = ctx.request.body.logo as string;
    const gameObj = ctx.request.body;

    if (logoString) {
      const { error, imageUrl } = await loadImageToHost(logoString);

      if (error) ctx.throw(500, "Error occured while loading game logo");
      else gameObj.logo = imageUrl;
    }

    const game = await Game.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, gameObj);

    if (!game) ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

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
  },
  post: async (ctx) => {
    const genresIds = [...ctx.request.body.genresIds] as number[];

    delete ctx.request.body.genresIds;

    const logoString = ctx.request.body.logo as string;

    const { error, imageUrl } = await loadImageToHost(logoString);

    if (error) ctx.throw(500, "Error occured while loading game logo");

    const game = await Game.query().insert({
      ...ctx.request.body,
      logo: imageUrl,
    });

    await Aigle.map(genresIds, (genreId) =>
      UsedGenre.query().insert({
        gameId: game.id,
        genreId: genreId,
      })
    );

    ctx.body = game;
  },
  query: async (ctx) => {
    const query = ctx.params.query as string;

    const games = await Game.query().where(
      raw('lower("name")'),
      "like",
      `%${query}%`
    );

    ctx.body = games;
  },
  block: async (ctx) => {
    const gameId = ctx.request.body.gameId as number;

    const game = await Game.query().findById(gameId);
    if (game.numberOfPhysicalCopies === 0)
      ctx.throw(404, "Game doesn't have physical copies left");

    const updatedGame = await Game.query().patchAndFetchById(gameId, {
      numberOfPhysicalCopies: +game.numberOfPhysicalCopies - 1,
    });

    ctx.body = updatedGame;
  },
  unblock: async (ctx) => {
    const gameId = ctx.request.body.gameId as number;

    const game = await Game.query().findById(gameId);

    const updatedGame = await Game.query().patchAndFetchById(gameId, {
      numberOfPhysicalCopies: +game.numberOfPhysicalCopies + 1,
    });

    ctx.body = updatedGame;
  },
};
