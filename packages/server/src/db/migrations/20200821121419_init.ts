import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("login").notNullable().unique();
      table.string("password").notNullable();
    })
    .createTable("gameCreators", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
      table.string("logo").notNullable();
      table.integer("yearOfFoundation").notNullable();
    })
    .createTable("discounts", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.integer("time").notNullable();
      table.string("amount").notNullable();
      table.integer("duration").notNullable();
    })
    .createTable("genres", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
    })
    .createTable("orders", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.integer("createdAt").notNullable();
      table.integer("price").notNullable();
    })
    .createTable("achievements", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
    })
    .createTable("games", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable();
      table.string("logo").notNullable();
      table.string("description").notNullable();
      table.integer("ageRating").notNullable();
      table.integer("price").notNullable();
      table.integer("numberOfPhysicalCopies").notNullable();
      table
        .uuid("gameCreatorId")
        .notNullable()
        .references("id")
        .inTable("gameCreators");
    })
    .createTable("usedDiscounts", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("discountId").references("discounts.id").onDelete("CASCADE");
      table.uuid("gameId").references("games.id").onDelete("CASCADE");
    })
    .createTable("usedGenres", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("genreId").notNullable().references("genres.id");
      table.uuid("gameId").notNullable().references("games.id");
    })
    .createTable("orderedGames", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("orderId").notNullable().references("orders.id");
      table.uuid("userId").notNullable().references("users.id");
      table.uuid("gameId").notNullable().references("games.id");
      table.integer("price").notNullable();
    })
    .createTable("unlockedAchievements", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("userId").notNullable().references("users.id");
      table.uuid("achievementId").notNullable().references("achievements.id");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .raw("DROP TABLE IF EXISTS users CASCADE")
    .raw("DROP TABLE IF EXISTS gameCreators CASCADE")
    .raw("DROP TABLE IF EXISTS discounts CASCADE")
    .raw("DROP TABLE IF EXISTS genres CASCADE")
    .raw("DROP TABLE IF EXISTS orders CASCADE")
    .raw("DROP TABLE IF EXISTS achievements CASCADE")
    .raw("DROP TABLE IF EXISTS games CASCADE")
    .raw("DROP TABLE IF EXISTS usedDiscounts CASCADE")
    .raw("DROP TABLE IF EXISTS usedGenres CASCADE")
    .raw("DROP TABLE IF EXISTS orderedGames CASCADE")
    .raw("DROP TABLE IF EXISTS unlockedAchievements CASCADE");
}
