/**
 * @param {import('@feathersjs/feathers').Application} app
 * @returns {import('knex').Knex}
 */
export const getDBClient = (app) => app.get('postgresqlClient')
