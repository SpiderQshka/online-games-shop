import { Model } from "objection";
// import { Game } from "./Game";
// import { Discount } from "./Discount";

export class UsedDiscount extends Model {
  id!: number;
  discountId!: string;
  gameId!: string;

  static tableName = "used_discounts";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        discountId: { type: "integer" },
        gameId: { type: "integer" },
      },
    };
  }
  // static relationMappings = {
  //   discountId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Discount,
  //     join: {
  //       from: "used_discounts.discountId",
  //       to: "discounts.id",
  //     },
  //   },
  //   gameId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Game,
  //     join: {
  //       from: "used_discounts.gameId",
  //       to: "games.id",
  //     },
  //   },
  // };
}
