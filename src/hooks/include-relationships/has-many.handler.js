/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */

import {
  buildServiceParams,
  mapOneToMany,
  pushIntoRelations
} from './helpers.js'

/**
 * Handles `hasMany` relationships.
 *
 * @type {RelationshipHandler}
 */
const hasManyHandler = async (
  context,
  mainResources,
  existingRelations,
  relationName,
  relationshipDefinition,
  relationshipKey
) => {
  const { app, params } = context
  const { service: serviceName, foreignKey } = relationshipDefinition

  const mainIds = extractMainIds(mainResources)

  if (mainIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const relatedService = app.service(serviceName)
  const query = buildQueryFromForeignKey(foreignKey, mainIds)

  const relatedResources = await relatedService.find(
    buildServiceParams(params, query)
  )

  const updatedResources = mapOneToMany({
    relatedResources,
    mainResources,
    relatedForeignKey: foreignKey,
    mainPrimaryKey: 'id',
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
 * Extracts the `id`s from main resources, ignoring nulls.
 *
 * @param {object[]} resources
 * @returns {unknown[]}
 */
const extractMainIds = (resources) =>
  resources.map((resource) => resource.id).filter((id) => id !== null)

/**
 * Builds a `$in` query for a foreign key.
 *
 * @param {string} foreignKey
 * @param {unknown[]} values
 * @returns {object}
 */
const buildQueryFromForeignKey = (foreignKey, values) => ({
  [foreignKey]: { $in: values }
})

export default hasManyHandler
