import { Model } from "objection";

export interface IGenre {
  id: number;
  name: string;
}

export class Genre extends Model {
  id!: number;
  name!: string;
  static tableName = "genres";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    };
  }
}
