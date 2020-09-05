import { Model } from "objection";

export class User extends Model {
  id!: number;
  login!: string;
  password!: string;
  isAdmin!: boolean;
  static tableName = "users";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["login", "password"],
      properties: {
        id: { type: "integer" },
        login: { type: "string" },
        password: { type: "string" },
        isAdmin: { type: "boolean" },
      },
    };
  }
}
