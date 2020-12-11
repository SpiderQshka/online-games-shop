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
    previousPhysicalGamesIds.map((id) => ({
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
    "id"
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

    const response = await Order.query()
      .findById(ctx.params.id)
      .catch(() =>
        ctx.throw(502, `Error occured while getting order from database`)
      );

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await Order.query().catch(() =>
      ctx.throw(502, `Error occured while getting orders from database`)
    );
    if (!response) ctx.throw(404, `No orders found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const orderedGames = await OrderedGame.query()
      .where("userId", user.id)
      .catch(() =>
        ctx.throw(502, `Error occured while getting orders from database`)
      );
    const ordersIds = _.uniq(orderedGames.map((el) => el.orderId));

    const orders = await Order.query()
      .whereIn("id", ordersIds)
      .catch(() =>
        ctx.throw(502, `Error occured while getting orders from database`)
      );

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
          ?.previousCopiesNumber || 0;
      game &&
        previousCopiesNumber !== 0 &&
        (await Game.query().patchAndFetchById(gameId, {
          numberOfPhysicalCopies:
            +game.numberOfPhysicalCopies + previousCopiesNumber,
        }));
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
      currentCopiesNumber !== 0 &&
        (await Game.query().patchAndFetchById(gameId, {
          numberOfPhysicalCopies:
            +game.numberOfPhysicalCopies - currentCopiesNumber,
        }));
    });

    const digitalGames: IGame[] = await Aigle.map(gamesIds, (id) =>
      Game.query().findById(id)
    );
    const physicalGames: IGame[] = await Aigle.map(
      currentPhysicalGamesIds,
      (id) => Game.query().findById(id)
    );

    const digitalGamesWithDiscounts = await Aigle.map(
      digitalGames,
      async (game) => {
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
            isPhysical: false,
          }),
        };
      }
    );

    const physicalGamesWithDiscounts = await Aigle.map(
      physicalGames,
      async (game) => {
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
            isPhysical: true,
          }),
        };
      }
    );

    const digitalGamesPrice = digitalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const physicalGamesPrice = physicalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );
    const updatedOrder = {
      price: digitalGamesPrice + physicalGamesPrice,
      status: ctx.request.body.status,
    };

    const order = await Order.query().patchAndFetchById(
      ctx.params.id,
      updatedOrder
    );

    const userId = (await OrderedGame.query().where("orderId", order.id))[0]
      .userId;

    await OrderedGame.query().delete().where("orderId", order.id);

    const orderedDigitalGames: IOrderedGame[] = await Aigle.map(
      digitalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId,
          price: +game.price,
          isPhysical: false,
        })
    );

    const orderedPhysicalGames: IOrderedGame[] = await Aigle.map(
      physicalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId,
          price: +game.price,
          isPhysical: true,
        })
    );

    ctx.body = {
      ...order,
      orderedGames: [...orderedDigitalGames, ...orderedPhysicalGames],
    };
  },
  post: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const gamesIds: number[] = ctx.request.body.gamesIds;
    const physicalGamesIds: number[] = ctx.request.body.physicalGamesCopiesIds;
    const physicalGamesConfig: {
      gameId: number;
      copiesNumber: number;
    }[] = _.uniqBy(
      physicalGamesIds.map((id) => ({
        gameId: id,
        copiesNumber: physicalGamesIds.reduce(
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
      "id"
    );

    const userGamesIds = (
      await OrderedGame.query()
        .where("userId", user.id)
        .where("isPhysical", false)
    ).map((el) => +el.gameId);

    if (_.intersection(gamesIds, userGamesIds).length !== 0)
      ctx.throw(400, `Some of games are already ordered on this account`);

    await Aigle.map(physicalGamesConfig, async ({ copiesNumber, gameId }) => {
      const game = await Game.query().findById(gameId);
      if (+game.numberOfPhysicalCopies - copiesNumber < 0)
        ctx.throw(
          404,
          `Game with id ${gameId} doesn't have ${copiesNumber} physical copies left`
        );
      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies - copiesNumber,
      });
    });

    const digitalGames: IGame[] = await Aigle.map(gamesIds, (id) =>
      Game.query().findById(id)
    );
    const physicalGames: IGame[] = await Aigle.map(physicalGamesIds, (id) =>
      Game.query().findById(id)
    );

    const digitalGamesWithDiscounts = await Aigle.map(
      digitalGames,
      async (game) => {
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
            isPhysical: false,
          }),
        };
      }
    );

    const physicalGamesWithDiscounts = await Aigle.map(
      physicalGames,
      async (game) => {
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
            isPhysical: true,
          }),
        };
      }
    );

    const digitalGamesPrice = digitalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const physicalGamesPrice = physicalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const order = await Order.query().insert({
      createdAt: new Date().toUTCString(),
      price: digitalGamesPrice + physicalGamesPrice,
      status: ctx.request.body.status,
    });

    const orderedDigitalGames: IOrderedGame[] = await Aigle.map(
      digitalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId: user.id,
          price: +game.price,
          isPhysical: false,
        })
    );

    const orderedPhysicalGames: IOrderedGame[] = await Aigle.map(
      physicalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId: user.id,
          price: +game.price,
          isPhysical: true,
        })
    );

    await checkAchievements(user.id);

    ctx.body = {
      ...order,
      orderedGames: [...orderedDigitalGames, ...orderedPhysicalGames],
    };
  },
  postAdmin: async (ctx) => {
    const gamesIds: number[] = ctx.request.body.gamesIds;
    const physicalGamesIds: number[] = ctx.request.body.physicalGamesCopiesIds;
    const userId: number = ctx.request.body.userId;
    const physicalGamesConfig: {
      gameId: number;
      copiesNumber: number;
    }[] = _.uniqBy(
      physicalGamesIds.map((id) => ({
        gameId: id,
        copiesNumber: physicalGamesIds.reduce(
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
      "id"
    );

    await Aigle.map(physicalGamesConfig, async ({ copiesNumber, gameId }) => {
      const game = await Game.query().findById(gameId);
      if (+game.numberOfPhysicalCopies - copiesNumber < 0)
        ctx.throw(
          404,
          `Game with id ${gameId} doesn't have ${copiesNumber} physical copies left`
        );
      await Game.query().patchAndFetchById(gameId, {
        numberOfPhysicalCopies: +game.numberOfPhysicalCopies - copiesNumber,
      });
    });

    const digitalGames: IGame[] = await Aigle.map(gamesIds, (id) =>
      Game.query().findById(id)
    );
    const physicalGames: IGame[] = await Aigle.map(physicalGamesIds, (id) =>
      Game.query().findById(id)
    );

    const digitalGamesWithDiscounts = await Aigle.map(
      digitalGames,
      async (game) => {
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
            isPhysical: false,
          }),
        };
      }
    );

    const physicalGamesWithDiscounts = await Aigle.map(
      physicalGames,
      async (game) => {
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
            isPhysical: true,
          }),
        };
      }
    );

    const digitalGamesPrice = digitalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const physicalGamesPrice = physicalGamesWithDiscounts.reduce(
      (prev, curr) => prev + +curr.price,
      0
    );

    const order = await Order.query().insert({
      createdAt: new Date().toUTCString(),
      price: digitalGamesPrice + physicalGamesPrice,
      status: ctx.request.body.status,
    });

    const orderedDigitalGames: IOrderedGame[] = await Aigle.map(
      digitalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId,
          price: +game.price,
          isPhysical: false,
        })
    );

    const orderedPhysicalGames: IOrderedGame[] = await Aigle.map(
      physicalGamesWithDiscounts,
      (game) =>
        OrderedGame.query().insert({
          gameId: game.id,
          orderId: order.id,
          userId,
          price: +game.price,
          isPhysical: true,
        })
    );

    await checkAchievements(userId);

    ctx.body = {
      ...order,
      orderedGames: [...orderedDigitalGames, ...orderedPhysicalGames],
    };
  },
};
