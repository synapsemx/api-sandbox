/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {string[]|string|null|undefined} InboundResources
 * @typedef {import('@types/relationships.js')} RelationshipDefinition
 */

/**
 * @param {HookContext} context
 * @returns {string}
 */
export const getResourceId = (context) =>
  context.method === 'create' ? context.result.id : context.id

/**
 * @param {string} method
 * @returns {boolean}
 */
export const isProcessableMethod = (method) =>
  ['create', 'update', 'patch'].includes(method)

/**
 * @param {string} type
 * @returns {boolean}
 */
export const isProcessableRelationshipType = (type) =>
  ['hasMany', 'manyToMany', 'belongsTo'].includes(type)

/**
 * @param {HookContext} context
 * @param {Object} query
 */
export const buildQuery = (context, query) => ({
  query,
  paginate: false,
  internal: true
})

/**
 * @param {HookContext} context
 * @param {Object} options
 * @param {boolean} [multi=true]
 */
export const buildParams = (context, options, multi = true) => ({
  adapter: { multi },
  internal: true,
  ...options
})

/**
 * @param {InboundResources} inboundRelationships
 * @param {RelationshipDefinition} definition
 * @param {string} relationName
 * @returns {boolean}
 */
export const shouldSkipRelationshipProcessing = (
  inboundRelationships,
  definition,
  relationName
) => {
  return (
    !(relationName in inboundRelationships) ||
    !isProcessableRelationshipType(definition.type)
  )
}
