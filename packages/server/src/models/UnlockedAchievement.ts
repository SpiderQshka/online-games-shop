import { Model } from "objection";

export class UnlockedAchievement extends Model {
  id!: number;
  achievementId!: number;
  userId!: number;
  seen!: boolean;
  static tableName = "unlocked_achievements";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        achievementId: { type: "integer" },
        userId: { type: "integer" },
        seen: { type: "boolean" },
      },
    };
  }
}
