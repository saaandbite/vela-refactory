
// packages/backend/migrations/20251207100001_chat_tables.js
/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('github_username', 255).notNullable().unique();
    table.string('backstage_user_ref', 255).notNullable().unique();
    table.string('display_name', 255);
    table.string('avatar_url', 255);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('chat_sessions', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')); // For PostgreSQL, use knex.raw('uuid_generate_v4()') if uuid-ossp extension is enabled
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('chat_messages', table => {
    table.increments('id').primary();
    table.uuid('session_id').notNullable().references('id').inTable('chat_sessions').onDelete('CASCADE');
    table.text('input_prompt');
    table.text('output_content');
    table.string('output_type', 50); // e.g., 'api_spec', 'text', 'error'
    table.string('status', 50).notNullable(); // e.g., 'completed', 'failed'
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('chat_messages');
  await knex.schema.dropTable('chat_sessions');
  await knex.schema.dropTable('users');
};
