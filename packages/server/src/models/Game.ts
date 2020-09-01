import { Model } from "objection";

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
        id: { type: "integer" },
        name: { type: "string" },
        logo: { type: ["string", "null"] },
        description: { type: ["string", "null"] },
        ageRating: { type: ["integer", "null"] },
        price: { type: "number" },
        numberOfPhysicalCopies: { type: "integer" },
        gameCreatorId: { type: "integer" },
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
