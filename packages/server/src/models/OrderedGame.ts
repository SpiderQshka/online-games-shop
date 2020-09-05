import { Model } from "objection";

export interface IOrderedGame {
  id: number;
  orderId: number;
  userId: number;
  gameId: number;
  price: number;
}

export class OrderedGame extends Model {
  id!: number;
  orderId!: number;
  userId!: number;
  gameId!: number;
  price!: number;

  static tableName = "ordered_games";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        orderId: { type: "integer" },
        userId: { type: "integer" },
        gameId: { type: "integer" },
        price: { type: "number" },
      },
    };
  }
  static doesOrderRelateToUser = async (orderId: number, userId: number) => {
    const result = await OrderedGame.query()
      .where("orderId", orderId)
      .where("userId", userId);
    return !!result.length;
  };
}
