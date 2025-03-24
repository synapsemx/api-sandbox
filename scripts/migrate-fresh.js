import { app } from '../src/app.js'
import { getDBClient } from '../src/utils/db.js'

if (process.env.NODE_ENV !== 'test') {
  console.error('This script can only be run in test environment')
  process.exit(1)
}

const migrateFresh = async () => {
  const db = getDBClient(app)

  await db.raw('DROP SCHEMA IF EXISTS public CASCADE')
  await db.raw('CREATE SCHEMA public')
  await db.migrate.latest()

  process.exit(0)
}

migrateFresh()
