import { Model } from "objection";
// import { GameCreator } from "./GameCreator";
export class Game extends Model {
  id!: number;
  name!: string;
  logo!: string;
  description!: string;
  ageRating!: number;
  price!: number;
  numberOfPhysicalCopies!: number | null;
  gameCreatorId!: string;
  static tableName = "games";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "price", "gameCreatorId"],
      properties: {
        id: { type: "uuid" },
        name: { type: "string" },
        logo: { type: ["string", "null"] },
        description: { type: ["string", "null"] },
        ageRating: { type: ["integer", "null"] },
        price: { type: "number" },
        numberOfPhysicalCopies: { type: "integer" },
        gameCreatorId: { type: "uuid" },
      },
    };
  }
  // static relationMappings = {
  //   gameCreatorId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: GameCreator,
  //     join: {
  //       from: "games.gameCreatorId",
  //       to: "game_creators.id",
  //     },
  //   },
  // };
}
