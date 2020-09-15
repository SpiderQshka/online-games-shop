import { Model } from "objection";

export class UsedGenre extends Model {
  id!: number;
  genreId!: number;
  gameId!: number;
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
}
