import { Model } from "objection";

export class Discount extends Model {
  id!: number;
  startDate!: Date;
  endDate!: Date;
  amount!: number;
  type!: string;
  static tableName = "discounts";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["startDate", "endDate", "amount", "type"],
      properties: {
        id: { type: "integer" },
        startDate: { type: "date" },
        endDate: { type: "date" },
        amount: { type: "number" },
        type: { type: "string" },
      },
    };
  }
}
