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
 * Handles many-to-many relationships using the pivot table directly.
 *
 * @type {RelationshipHandler}
 */
const manyToManyHandler = async (
  context,
  mainResources,
  existingRelations,
  relationName,
  relationshipDefinition,
  relationshipKey
) => {
  const { app, params } = context
  const relatedService = app.service(relationshipDefinition.service)
  const pivotService = app.service(relationshipDefinition.pivotService)

  const mainIds = extractMainIds(mainResources)

  if (mainIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const { primaryKey, relatedKey } = relationshipDefinition

  const pivotResources = await pivotService._find(
    buildServiceParams(params, {
      [primaryKey]: { $in: mainIds },
      $select: [primaryKey, relatedKey]
    })
  )

  const relatedIds = pivotResources.map((r) => r[relatedKey])

  const relatedResources = await relatedService.find(
    buildServiceParams(params, {
      id: { $in: relatedIds }
    })
  )

  const relatedWithPivot = pivotResources.map((pivot) => ({
    id: pivot[relatedKey],
    id_ref: pivot[primaryKey]
  }))

  const updatedResources = mapOneToMany({
    relatedResources: relatedWithPivot,
    mainResources,
    relatedForeignKey: 'id_ref',
    mainPrimaryKey: 'id',
    relationKey: relationName
  })

  const updatedRelations = pushIntoRelations({
    relationKey: relationshipKey,
    newRelatedItems: relatedResources,
    relations: existingRelations
  })

  return {
    updatedResources,
    updatedRelations
  }
}

/**
 * Extracts IDs from main resources.
 *
 * @param {object[]} resources
 * @returns {unknown[]}
 */
const extractMainIds = (resources) =>
  resources.map((r) => r.id).filter((id) => id !== null)

export default manyToManyHandler
