import { Model } from "objection";
export class User extends Model {
  id!: string;
  login!: string;
  password!: string;
  static tableName = "users";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["login", "password"],
      properties: {
        id: { type: "uuid" },
        login: { type: "string" },
        password: { type: "string" },
      },
    };
  }
}
