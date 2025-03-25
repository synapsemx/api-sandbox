/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */
import belongsToHandler from './belongs-to.handler.js'
// import hasManyHandler from './has-many.handler.js'
// import hasOneHandler from './has-one.handler.js'
import { filterRelationsByUnique, relationshipKeyName } from './helpers.js'
// import manyToManyHandler from './many-to-many.handler.js'
// import morphManyHandler from './morph-many.handler.js'
// import morphToHandler from './morph-to.handler.js'

const relationshipHandlersMap = {
  belongsTo: belongsToHandler
  // hasOne: hasOneHandler,
  // hasMany: hasManyHandler,
  // manyToMany: manyToManyHandler,
  // morphTo: morphToHandler,
  // morphMany: morphManyHandler
}

/**
 * Enriches the result of a Feathers hook by including defined relationships.
 *
 * @param {HookContext} context
 * @returns {Promise<HookContext>}
 */
const includeRelationships = async (context) => {
  const result = context.result
  const relationshipsConfig = context.params.includeRelationships || {}

  if (!shouldProcessResult(result)) {
    return context
  }

  const isPaginatedResult = isPaginated(result)
  const isSingleResult = isSingle(result)
  const { resources, wrap } = extractResources(
    result,
    isPaginatedResult,
    isSingleResult
  )

  const enrichedResources = await attachRelationships(
    context,
    resources.filter(Boolean),
    relationshipsConfig
  )

  context.result = wrap(enrichedResources.resources)

  if (isPaginatedResult || isSingleResult) {
    context.result.relations = filterRelationsByUnique(enrichedResources)
  }

  return context
}

export default includeRelationships

/**
 * Checks if the hook result should be processed.
 *
 * @param {any} result
 * @returns {boolean}
 */
const shouldProcessResult = (result) => {
  if (!result) return false
  if ('data' in result && !result.data) return false
  return true
}

/**
 * Determines whether the result is paginated.
 *
 * @param {any} result
 * @returns {boolean}
 */
const isPaginated = (result) => 'data' in result

/**
 * Determines whether the result is a single resource.
 *
 * @param {any} result
 * @returns {boolean}
 */
const isSingle = (result) => !Array.isArray(result)

/**
 * Extracts resources from a hook result and returns a wrap function.
 *
 * @param {Record<string, unknown>} result
 * @param {boolean} isPaginated
 * @param {boolean} isSingle
 * @returns {{ resources: Record<string, unknown>[], wrap: (data: Record<string, unknown>[]) => Record<string, unknown> }}
 */
const extractResources = (result, isPaginated, isSingle) => {
  if (isPaginated) {
    return {
      resources: result.data,
      wrap: (data) => ({ ...result, data })
    }
  }

  if (isSingle) {
    return {
      resources: [result],
      wrap: (data) => data[0]
    }
  }

  return {
    resources: result,
    wrap: (data) => data
  }
}

/**
 * Attaches relationships to a list of resources using the provided configuration.
 *
 * @param {HookContext} context
 * @param {Record<string, unknown>[]} resources
 * @param {Record<string, any>} relationshipsConfig
 * @returns {Promise<{ resources: Record<string, unknown>[], relations: Record<string, unknown[]> }>}
 */
const attachRelationships = async (context, resources, relationshipsConfig) => {
  let currentResources = resources
  let allRelations = {}

  for (const [relationName, relationDefinition] of Object.entries(
    relationshipsConfig
  )) {
    const handler = resolveRelationshipHandler(relationDefinition.type)
    const relationKey = relationshipKeyName(relationDefinition.service)

    if (!(relationKey in allRelations)) {
      allRelations[relationKey] = []
    }

    const { updatedResources, updatedRelations } = await handler(
      context,
      currentResources,
      allRelations,
      relationName,
      relationDefinition,
      relationKey
    )

    currentResources = updatedResources
    allRelations = updatedRelations
  }

  return {
    resources: currentResources,
    relations: allRelations
  }
}

/**
 * Returns the handler function for a given relationship type.
 *
 * @param {string} type
 * @returns {RelationshipHandler}
 */
const resolveRelationshipHandler = (type) => {
  const handler = relationshipHandlersMap[type]

  if (!handler) {
    throw new Error(`Invalid relationship type: ${type}`)
  }

  return handler
}
