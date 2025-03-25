/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */

import {
  buildServiceParams,
  mapOneToOne,
  pushIntoRelations
} from './helpers.js'

/**
 * Handles `belongsTo` relationships.
 *
 * @type {RelationshipHandler}
 */
const belongsToHandler = async (
  context,
  mainResources,
  existingRelations,
  relationName,
  relationshipDefinition,
  relationshipKey
) => {
  const { app, params } = context
  const { service: serviceName, foreignKey } = relationshipDefinition

  const relatedIds = extractForeignKeys(mainResources, foreignKey)

  if (relatedIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const relatedService = app.service(serviceName)
  const query = buildQueryFromIds(relatedIds)
  const relatedResources = await relatedService.find(
    buildServiceParams(params, query)
  )

  const updatedResources = mapOneToOne({
    relatedResources,
    mainResources,
    relatedForeignKey: 'id',
    mainPrimaryKey: foreignKey,
    relationKey: relationName
  })

  const updatedRelations = pushIntoRelations({
    relationKey: relationshipKey,
    newRelatedItems: relatedResources,
    relations: existingRelations
  })

  return { updatedResources, updatedRelations }
}

/**
 * Extracts non-null foreign key values from resources.
 *
 * @param {object[]} resources
 * @param {string} key
 * @returns {unknown[]}
 */
const extractForeignKeys = (resources, key) =>
  resources.map((resource) => resource[key]).filter(Boolean)

/**
 * Builds a `$in` query for the given IDs.
 *
 * @param {unknown[]} ids
 * @returns {object}
 */
const buildQueryFromIds = (ids) => ({
  id: { $in: ids }
})

export default belongsToHandler
