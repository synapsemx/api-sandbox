import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PostsService extends KnexService {}

/**
 * @param {import('@feathersjs/feathers').Application} app
 * @param {import('@types/relationships').RelationshipsMap} relationships
 */
export const getOptions = (app, relationships) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'posts',
    relationships
  }
}
