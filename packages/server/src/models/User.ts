import { Model } from "objection";
import bcrypt from "bcrypt";

export interface IUser {
  id: number;
  login: string;
  password: string;
  isAdmin: boolean;
}

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
  static hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  static checkPassword = (password: string, hash: string) => {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
  };
}
