import KnexService from '../../lib/knex/service.js'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PostsService extends KnexService {}

/**
 * @param {import('@feathersjs/feathers').Application} app
 * @param {import('@types/relationships').RelationshipsMap} relationships
 * @param {string} tableName
 */
export const getOptions = (app, relationships, tableName) => {
  return {
    app,
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: tableName,
    relationships
  }
}
