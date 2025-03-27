import { app } from '../src/app.js'
import { getDBClient } from '../src/utils/db.js'

if (!['development', 'test'].includes(app.get('env'))) {
  console.error(
    'Cannot run this script outside of development or test environment'
  )
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
