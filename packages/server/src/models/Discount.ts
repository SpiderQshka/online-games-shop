import { Model } from "objection";

export interface IDiscount {
  id: number;
  startDate: Date;
  duration: number;
  amount: string;
}

export class Discount extends Model {
  id!: number;
  startDate!: Date;
  duration!: number;
  amount!: string;
  static tableName = "discounts";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["startDate", "duration", "amount"],
      properties: {
        id: { type: "integer" },
        startDate: { type: "string", format: "date" },
        duration: { type: "number" },
        amount: { type: "string" },
      },
    };
  }
}
