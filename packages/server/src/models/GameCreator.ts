import { Model } from "objection";

export interface IGameCreator {
  id: number;
  name: string;
  logo: string;
  yearOfFoundation: number;
}

export class GameCreator extends Model {
  id!: string;
  name!: string;
  logo!: string;
  yearOfFoundation!: number;
  static tableName = "game_creators";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        logo: { type: "string" },
        yearOfFoundation: { type: "integer" },
      },
    };
  }
}
