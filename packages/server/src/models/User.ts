import { Model } from "objection";
export class User extends Model {
  id!: number;
  login!: string;
  password!: string;
  boughtGames!: number[] | null;
  achievements!: number[] | null;
  static tableName = "users";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["login", "password"],
      properties: {
        id: { type: "integer" },
        login: { type: "string" },
        password: { type: "string" },
        // boughtGames: { type: "array", item: { type: "integer" } },
        // achievements: { type: "array", item: { type: "integer" } },
      },
    };
  }
}
// , items: { type: "integer" }
