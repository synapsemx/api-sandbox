export const relationshipTypes = {
  belongsTo: 'belongsTo',
  hasMany: 'hasMany',
  manyToMany: 'manyToMany',
  morphMany: 'morphMany',
  morphTo: 'morphTo'
}

/**
 * @param {import('@feathersjs/feathers').Application} app
 * @param {string} serviceName
 * @returns {string}
 */
export const getServiceTableName = (app, serviceName) => {
  const service = app.service(serviceName)

  return service.options.name
}

/**
 * Extracts IDs from resources, using the given key (default: "id"), ignoring null values.
 *
 * @param {Record<string, unknown>[]} resources
 * @param {string} [key='id']
 * @returns {string[]}
 */
export const extractIds = (resources, key = 'id') =>
  resources.map((resource) => resource[key]).filter(Boolean)
