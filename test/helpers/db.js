import { afterEach, beforeEach } from 'vitest'
import { app } from '../../src/app.js'
import { getDBClient } from '../../src/utils/db.js'

export const resetDatabaseUsingTransaction = () => {
  const db = getDBClient(app)

  beforeEach(async () => {
    await db.raw('BEGIN')
  })

  afterEach(async () => {
    await db.raw('ROLLBACK')
  })
}

export const clearTable = async (table) => {
  await db.raw('TRUNCATE TABLE ?? RESTART IDENTITY CASCADE', [table])
}
