import { app } from '../app.js'
import { getDBClient } from './db.js'

/**
 * @param {Rescord<string, unknown>} data
 * @param {string} table
 * @returns {Promise<Rescord<string, unknown>>}
 */
export const insert = async (data, table) => {
  const db = getDBClient(app)

  return (await db.insert(data).into(table).returning('*'))[0]
}
