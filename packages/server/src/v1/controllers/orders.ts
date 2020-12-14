import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { Order } from "models/Order";
import { OrderedGame } from "models/OrderedGame";
import { verifyJwtToken } from "v1/auth";
import { doesOrderRelateToUser } from "models/helpers";
import { IOrderedGame, IGame } from "models/types";
import { Game } from "models/Game";
import _ from "lodash";
import Aigle from "aigle";
import {
  getOptimalGamePrice,
  doesCurrentDateSuitDiscount,
  getHightestGameDiscount,
  getAchievementDiscount,
  checkAchievements,
} from "v1/helpers";

Aigle.mixin(_, {});

Model.knex(knex);

interface IOrdersController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
  postAdmin: Middleware;
}

const getPhysicalGamesConfig: (
  previousPhysicalGamesIds: number[],
  currentPhysicalGamesIds: number[]
) => {
  gameId: number;
  previousCopiesNumber: number;
  currentCopiesNumber: number;
}[] = (previousPhysicalGamesIds, currentPhysicalGamesIds) =>
  _.uniqBy(
    currentPhysicalGamesIds.map((id) => ({
      gameId: id,
      previousCopiesNumber: previousPhysicalGamesIds.reduce(
        (prev, curr) => {
          return {
            id,
            copiesNumber:
              curr === id ? prev.copiesNumber + 1 : prev.copiesNumber,
          };
        },
        { id, copiesNumber: 0 }
      ).copiesNumber,
      currentCopiesNumber: currentPhysicalGamesIds.reduce(
        (prev, curr) => {
          return {
            id,
            copiesNumber:
              curr === id ? prev.copiesNumber + 1 : prev.copiesNumber,
          };
        },
        { id, copiesNumber: 0 }
      ).copiesNumber,
    })),
    "gameId"
  );

export const ordersController: IOrdersController = {
  get: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToCurrrentUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    const response = await Order.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Order.query();
    if (!response) ctx.throw(404, `No orders found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const orderedGames = await OrderedGame.query().where("userId", user.id);

    const ordersIds = _.uniq(orderedGames.map((el) => el.orderId));

    const orders = await Order.query().whereIn("id", ordersIds);

    if (!orders)
      ctx.throw(404, `Orders for user with id '${user.id}' were not found`);

    await checkAchievements(user.id);

    ctx.body = orders;
  },
  put: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const doesOrderRelateToCurrrentUser = await doesOrderRelateToUser(
      ctx.params.id,
      user.id
    );

    if (!doesOrderRelateToCurrrentUser && !user.isAdmin)
      ctx.throw(403, "Access denied");

    const gamesIds: number[] = ctx.request.body.gamesIds;
    const currentPhysicalGamesIds: number[] =
      ctx.request.body.physicalGamesCopiesIds;

    const previousPhysicalGamesIds = (
      await OrderedGame.query()
        .where("orderId", ctx.params.id)
        .where("isPhysical", true)
    ).map((item) => item.gameId);

    const physicalGamesConfig = getPhysicalGamesConfig(
      previousPhysicalGamesIds,
      currentPhysicalGamesIds
    );

    await Aigle.map(previousPhysicalGamesIds, async (gameId) => {
      const game = await Game.query().findById(gameId);

      const previousCopiesNumber =
        physicalGamesConfig.filter((item) => item.gameId === gameId)[0]
          ?.currentCopiesNumber || 0;

      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies:
          +game.numberOfPhysicalCopies + previousCopiesNumber,
      });
    });

    await Aigle.map(currentPhysicalGamesIds, async (gameId) => {
      const game = await Game.query().findById(gameId);

      const currentCopiesNumber =
        physicalGamesConfig.filter((item) => item.gameId === gameId)[0]
          ?.currentCopiesNumber || 0;

      if (+game.numberOfPhysicalCopies < currentCopiesNumber)
        ctx.throw(
          404,
          `Game with id ${gameId} doesn't have ${currentCopiesNumber} physical copies left`
        );

      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies:
          +game.numberOfPhysicalCopies - currentCopiesNumber,
      });
    });

    const digitalGames = (
      await Game.query().whereIn("id", gamesIds)
    ).map((game) => ({ ...game, isPhysical: false }));

    const physicalGames = (
      await Game.query().whereIn("id", currentPhysicalGamesIds)
    )
      .map((game) => {
        const dublicatesNumber =
          physicalGamesConfig.filter((item) => item.gameId === game.id)[0]
            ?.currentCopiesNumber || 0;
        return _.fill(Array(dublicatesNumber), { ...game, isPhysical: true });
      })
      .flat();

    const gamesWithDiscount = await Aigle.map(
      [...digitalGames, ...physicalGames],
      async (game) => {
        const isPhysical = game.isPhysical;
        const gameHightestDiscount = await getHightestGameDiscount(game);
        const gameDiscount =
          gameHightestDiscount &&
          doesCurrentDateSuitDiscount(gameHightestDiscount)
            ? gameHightestDiscount
            : null;

        const achievementDiscountSize = await getAchievementDiscount(user.id);
        return {
          ...game,
          price: getOptimalGamePrice({
            game,
            achievementDiscountSize,
            gameDiscount,
            isPhysical,
          }),
          isPhysical,
        };
      }
    );

    const gamesPrice = gamesWithDiscount.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const orderObj = {
      price: gamesPrice,
      status: ctx.request.body.status,
    };

    const order = await Order.query().patchAndFetchById(
      ctx.params.id,
      orderObj
    );

    await OrderedGame.query().delete().where("orderId", order.id);

    const orderedGamesToInsert = gamesWithDiscount.map((game) => ({
      gameId: game.id,
      orderId: order.id,
      userId: user.id,
      price: +game.price,
      isPhysical: game.isPhysical,
    }));

    const orderedGames = await OrderedGame.query().insert(orderedGamesToInsert);

    ctx.body = {
      ...order,
      orderedGames,
    };
  },
  post: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const gamesIds: number[] = ctx.request.body.gamesIds;
    const physicalGamesIds: number[] = ctx.request.body.physicalGamesCopiesIds;
    const physicalGamesConfig = getPhysicalGamesConfig([], physicalGamesIds);

    const userGamesIds = (
      await OrderedGame.query()
        .where("userId", user.id)
        .where("isPhysical", false)
    ).map((el) => +el.gameId);

    if (_.intersection(gamesIds, userGamesIds).length !== 0)
      ctx.throw(400, `Some of games are already ordered on this account`);

    await Aigle.map(physicalGamesIds, async (gameId) => {
      const game = await Game.query().findById(gameId);

      const currentCopiesNumber =
        physicalGamesConfig.filter((item) => item.gameId === gameId)[0]
          ?.currentCopiesNumber || 0;

      if (+game.numberOfPhysicalCopies < currentCopiesNumber)
        ctx.throw(
          404,
          `Game with id ${gameId} doesn't have ${currentCopiesNumber} physical copies left`
        );

      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies:
          +game.numberOfPhysicalCopies - currentCopiesNumber,
      });
    });

    const digitalGames = (
      await Game.query().whereIn("id", gamesIds)
    ).map((game) => ({ ...game, isPhysical: false }));

    const physicalGames = (await Game.query().whereIn("id", physicalGamesIds))
      .map((game) => {
        const dublicatesNumber =
          physicalGamesConfig.filter((item) => item.gameId === game.id)[0]
            ?.currentCopiesNumber || 0;
        return _.fill(Array(dublicatesNumber), { ...game, isPhysical: true });
      })
      .flat();

    const gamesWithDiscount = await Aigle.map(
      [...digitalGames, ...physicalGames],
      async (game) => {
        const isPhysical = game.isPhysical;
        const gameHightestDiscount = await getHightestGameDiscount(game);
        const gameDiscount =
          gameHightestDiscount &&
          doesCurrentDateSuitDiscount(gameHightestDiscount)
            ? gameHightestDiscount
            : null;

        const achievementDiscountSize = await getAchievementDiscount(user.id);
        return {
          ...game,
          price: getOptimalGamePrice({
            game,
            achievementDiscountSize,
            gameDiscount,
            isPhysical,
          }),
          isPhysical,
        };
      }
    );

    const gamesPrice = gamesWithDiscount.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const orderObj = {
      price: gamesPrice,
      status: ctx.request.body.status,
      createdAt: new Date().toUTCString(),
    };

    const order = await Order.query().insert(orderObj);

    await OrderedGame.query().delete().where("orderId", order.id);

    const orderedGamesToInsert = gamesWithDiscount.map((game) => ({
      gameId: game.id,
      orderId: order.id,
      userId: user.id,
      price: +game.price,
      isPhysical: game.isPhysical,
    }));

    const orderedGames = await OrderedGame.query().insert(orderedGamesToInsert);

    await checkAchievements(user.id);

    ctx.body = {
      ...order,
      orderedGames,
    };
  },
  postAdmin: async (ctx) => {
    const gamesIds: number[] = ctx.request.body.gamesIds;
    const physicalGamesIds: number[] = ctx.request.body.physicalGamesCopiesIds;
    const userId: number = ctx.request.body.userId;
    const physicalGamesConfig = getPhysicalGamesConfig([], physicalGamesIds);

    await Aigle.map(physicalGamesIds, async (gameId) => {
      const game = await Game.query().findById(gameId);

      const currentCopiesNumber =
        physicalGamesConfig.filter((item) => item.gameId === gameId)[0]
          ?.currentCopiesNumber || 0;

      if (+game.numberOfPhysicalCopies < currentCopiesNumber)
        ctx.throw(
          404,
          `Game with id ${gameId} doesn't have ${currentCopiesNumber} physical copies left`
        );

      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies:
          +game.numberOfPhysicalCopies - currentCopiesNumber,
      });
    });

    const digitalGames = (
      await Game.query().whereIn("id", gamesIds)
    ).map((game) => ({ ...game, isPhysical: false }));

    const physicalGames = (await Game.query().whereIn("id", physicalGamesIds))
      .map((game) => {
        const dublicatesNumber =
          physicalGamesConfig.filter((item) => item.gameId === game.id)[0]
            ?.currentCopiesNumber || 0;
        return _.fill(Array(dublicatesNumber), { ...game, isPhysical: true });
      })
      .flat();

    const gamesWithDiscount = await Aigle.map(
      [...digitalGames, ...physicalGames],
      async (game) => {
        const isPhysical = game.isPhysical;
        const gameHightestDiscount = await getHightestGameDiscount(game);
        const gameDiscount =
          gameHightestDiscount &&
          doesCurrentDateSuitDiscount(gameHightestDiscount)
            ? gameHightestDiscount
            : null;

        const achievementDiscountSize = await getAchievementDiscount(userId);
        return {
          ...game,
          price: getOptimalGamePrice({
            game,
            achievementDiscountSize,
            gameDiscount,
            isPhysical,
          }),
          isPhysical,
        };
      }
    );

    const gamesPrice = gamesWithDiscount.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const orderObj = {
      price: gamesPrice,
      status: ctx.request.body.status,
      createdAt: new Date().toUTCString(),
    };

    const order = await Order.query().insert(orderObj);

    await OrderedGame.query().delete().where("orderId", order.id);

    const orderedGamesToInsert = gamesWithDiscount.map((game) => ({
      gameId: game.id,
      orderId: order.id,
      userId,
      price: +game.price,
      isPhysical: game.isPhysical,
    }));

    const orderedGames = await OrderedGame.query().insert(orderedGamesToInsert);

    await checkAchievements(userId);

    ctx.body = {
      ...order,
      orderedGames,
    };
  },
};
