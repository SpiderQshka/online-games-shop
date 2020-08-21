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
      table.string("logo").notNullable();
      table.integer("year_of_foundation").notNullable();
    })
    .createTable("discounts", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.integer("time").notNullable();
      table.integer("amount").notNullable();
    })
    .createTable("genres", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.string("name").notNullable().unique();
    })
    .createTable("orders", (table) => {
      table.uuid("id").unique().primary().notNullable();
      table.integer("created_at").notNullable();
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
      table.integer("number_of_physical_copies").notNullable();
      table
        .uuid("game_creator_id")
        .notNullable()
        .references("id")
        .inTable("game_creators");
    })
    .createTable("used_discounts", (table) => {
      table.increments();
      table.uuid("discount_id").references("discounts.id").onDelete("CASCADE");
      table.uuid("game_id").references("games.id").onDelete("CASCADE");
    })
    .createTable("used_genres", (table) => {
      table.increments();
      table
        .uuid("genre_id")
        .notNullable()
        .references("genres.id")
        .onDelete("CASCADE");
      table
        .uuid("game_id")
        .notNullable()
        .references("games.id")
        .onDelete("CASCADE");
    })
    .createTable("ordered_games", (table) => {
      table.increments();
      table
        .uuid("order_id")
        .notNullable()
        .references("orders.id")
        .onDelete("CASCADE");
      table
        .uuid("user_id")
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .uuid("game_id")
        .notNullable()
        .references("games.id")
        .onDelete("CASCADE");
      table.integer("price").notNullable();
    })
    .createTable("unlocked_achievements", (table) => {
      table.increments();
      table
        .uuid("user_id")
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .uuid("achievement_id")
        .notNullable()
        .references("achievements.id")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .raw("DROP TABLE users CASCADE")
    .raw("DROP TABLE game_creators CASCADE")
    .raw("DROP TABLE discounts CASCADE")
    .raw("DROP TABLE genres CASCADE")
    .raw("DROP TABLE orders CASCADE")
    .raw("DROP TABLE achievements CASCADE")
    .raw("DROP TABLE games CASCADE")
    .raw("DROP TABLE used_discounts CASCADE")
    .raw("DROP TABLE used_genres CASCADE")
    .raw("DROP TABLE ordered_games CASCADE")
    .raw("DROP TABLE unlocked_achievements CASCADE");
  // .dropTableIfExists("game_creators")
  // .dropTableIfExists("discounts")
  // .dropTableIfExists("genres")
  // .dropTableIfExists("orders")
  // .dropTableIfExists("achievements")
  // .dropTableIfExists("games")
  // .dropTableIfExists("used_discounts")
  // .dropTableIfExists("used_genres")
  // .dropTableIfExists("ordered_games")
  // .dropTableIfExists("unlocked_achievements");
}
