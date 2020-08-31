import { Model } from "objection";
// import { Genre } from "./Genre";
// import { Game } from "./Game";

export class UsedGenre extends Model {
  id!: number;
  genreId!: string;
  gameId!: string;
  static tableName = "used_genres";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        genreId: { type: "integer" },
        gameId: { type: "integer" },
      },
    };
  }
  // static relationMappings = {
  //   genreId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Genre,
  //     join: {
  //       from: "used_genres.genreId",
  //       to: "genres.id",
  //     },
  //   },
  //   gameId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Game,
  //     join: {
  //       from: "used_genres.gameId",
  //       to: "games.id",
  //     },
  //   },
  // };
}
