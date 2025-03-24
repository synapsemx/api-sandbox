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
