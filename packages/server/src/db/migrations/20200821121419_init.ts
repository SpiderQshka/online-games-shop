import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("login").notNullable().unique();
      table.string("password").notNullable();
    })
    .createTable("game_creators", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
      table.string("logo").nullable();
      table.bigInteger("yearOfFoundation").notNullable();
    })
    .createTable("discounts", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.date("time").notNullable();
      table.string("amount").notNullable();
      table.bigInteger("duration").notNullable();
    })
    .createTable("genres", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
    })
    .createTable("orders", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.date("createdAt").notNullable();
      table.bigInteger("price").notNullable();
    })
    .createTable("achievements", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
    })
    .createTable("games", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable();
      table.string("logo").nullable();
      table.text("description").nullable();
      table.bigInteger("ageRating").nullable();
      table.bigInteger("price").notNullable();
      table.bigInteger("numberOfPhysicalCopies").notNullable();
      table
        .uuid("gameCreatorId")
        .notNullable()
        .references("id")
        .inTable("game_creators");
    })
    .createTable("used_discounts", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("discountId").references("discounts.id");
      table.uuid("gameId").references("games.id");
    })
    .createTable("used_genres", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("genreId").notNullable().references("genres.id");
      table.uuid("gameId").notNullable().references("games.id");
    })
    .createTable("ordered_games", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("orderId").notNullable().references("orders.id");
      table.uuid("userId").notNullable().references("users.id");
      table.uuid("gameId").notNullable().references("games.id");
      table.bigInteger("price").notNullable();
    })
    .createTable("unlocked_achievements", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.uuid("userId").notNullable().references("users.id");
      table.uuid("achievementId").notNullable().references("achievements.id");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .raw("DROP TABLE IF EXISTS users CASCADE")
    .raw("DROP TABLE IF EXISTS game_creators CASCADE")
    .raw("DROP TABLE IF EXISTS discounts CASCADE")
    .raw("DROP TABLE IF EXISTS genres CASCADE")
    .raw("DROP TABLE IF EXISTS orders CASCADE")
    .raw("DROP TABLE IF EXISTS achievements CASCADE")
    .raw("DROP TABLE IF EXISTS games CASCADE")
    .raw("DROP TABLE IF EXISTS used_discounts CASCADE")
    .raw("DROP TABLE IF EXISTS used_genres CASCADE")
    .raw("DROP TABLE IF EXISTS ordered_games CASCADE")
    .raw("DROP TABLE IF EXISTS unlocked_achievements CASCADE");
}
