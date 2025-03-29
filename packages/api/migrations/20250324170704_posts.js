/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table
      .uuid('category_id')
      .references('id')
      .inTable('categories')
      .notNullable()
    table.uuid('parent_id').references('id').inTable('posts').nullable()
    table.string('content')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('posts')
}
