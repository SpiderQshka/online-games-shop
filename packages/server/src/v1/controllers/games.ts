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
import { Models } from "models";

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

    const myGames = await Game.query()
      .where("userId", user.id)
      .join(
        Models.orderedGames.tableName,
        `${Models.orderedGames.tableName}.gameId`,
        `${Models.games.tableName}.id`
      )
      .select(
        `${Models.games.tableName}.id`,
        `${Models.games.tableName}.name`,
        `${Models.games.tableName}.logo`,
        `${Models.games.tableName}.description`,
        `${Models.games.tableName}.ageRating`,
        `${Models.games.tableName}.price`,
        `${Models.games.tableName}.numberOfPhysicalCopies`,
        `${Models.games.tableName}.gameCreatorId`,
        `${Models.games.tableName}.createdAt`,
        `${Models.games.tableName}.physicalCopyPrice`,
        `${Models.orderedGames.tableName}.isPhysical`
      );

    await checkAchievements(user.id);

    ctx.body = myGames;
  },
  put: async (ctx) => {
    const currentGenresIds = [...ctx.request.body.genresIds] as number[];

    delete ctx.request.body.genresIds;

    const logoString = ctx.request.body.logo as string;
    const gameObj = ctx.request.body;

    if (logoString) {
      const { error, imageUrl } = await loadImageToHost(logoString);

      if (error) ctx.throw(400, "Error occured while loading game logo");
      else gameObj.logo = imageUrl;
    }

    const game = await Game.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, gameObj);

    if (!game) ctx.throw(404, `Game with id '${ctx.params.id}' was not found`);

    const previousGenresIds = (
      await UsedGenre.query().where("gameId", game.id).select("genreId")
    ).map((usedGenre) => usedGenre.genreId);

    await UsedGenre.query()
      .delete()
      .where("gameId", game.id)
      .whereIn("genreId", previousGenresIds);

    const genresToInsert = currentGenresIds.map((genreId) => ({
      gameId: game.id,
      genreId,
    }));

    await UsedGenre.query().insert(genresToInsert);

    ctx.body = game;
  },
  post: async (ctx) => {
    const genresIds = [...ctx.request.body.genresIds] as number[];

    delete ctx.request.body.genresIds;

    const logoString = ctx.request.body.logo as string;

    const { error, imageUrl } = await loadImageToHost(logoString);

    if (error) ctx.throw(400, "Error occured while loading game logo");

    const gameObj = {
      ...ctx.request.body,
      logo: imageUrl,
    };

    const game = await Game.query().insert(gameObj);

    const genresToInsert = genresIds.map((genreId) => ({
      gameId: game.id,
      genreId,
    }));

    await UsedGenre.query().insert(genresToInsert);

    ctx.body = game;
  },
  query: async (ctx) => {
    const query = ctx.params.query as string;

    const games = await Game.query()
      .where(raw('lower("name")'), "like", `%${query}%`)
      .catch(() => ctx.throw(400, "Error occured while querying game"));

    ctx.body = games;
  },
  block: async (ctx) => {
    const gameId = ctx.request.body.gameId as number;

    const game = await Game.query().findById(gameId);
    if (game.numberOfPhysicalCopies <= 0)
      ctx.throw(404, "Game doesn't have physical copies left");

    const updatedGame = await Game.query()
      .patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies - 1,
      })
      .catch(() => ctx.throw(400, "Error occured while blocking game"));

    ctx.body = updatedGame;
  },
  unblock: async (ctx) => {
    const gameId = ctx.request.body.gameId as number;

    const game = await Game.query().findById(gameId);

    const updatedGame = await Game.query()
      .patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies + 1,
      })
      .catch(() => ctx.throw(400, "Error occured while unblocking game"));

    ctx.body = updatedGame;
  },
};
