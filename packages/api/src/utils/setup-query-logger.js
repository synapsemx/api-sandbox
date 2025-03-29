import { dbLogger } from '../logger.js'

/**
 * Replaces parameter placeholders ($1, $2, ...) in SQL with actual values.
 * @param {{ sql: string, bindings?: any[] }} query
 * @returns {string}
 */
const interpolateQuery = ({ sql, bindings = [] }) => {
  return bindings
    .reduce((interpolated, value, index) => {
      const placeholder = `$${index + 1}`
      const formatted =
        typeof value === 'string'
          ? `'${value.replace(/'/g, "''")}'`
          : String(value)

      return interpolated.replace(placeholder, formatted)
    }, sql)
    .replace(/"/g, "'")
}

/**
 * Sets up a listener to log every SQL query executed via knex.
 * @param {import('@feathersjs/feathers').Application} app
 */
const setupQueryLogger = (app) => {
  const db = app.get('postgresqlClient')

  db.on('query', (query) => {
    dbLogger.info({
      sql: interpolateQuery(query),
      timestamp: new Date().toISOString()
    })
  })
}

export default setupQueryLogger
