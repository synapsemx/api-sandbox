/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */

import { extractIds } from '../../utils/relationships.js'
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

  const mainIds = extractIds(mainResources)

  if (mainIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const relatedService = app.service(serviceName)
  const query = {
    [foreignKey]: { $in: mainIds }
  }

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

export default hasManyHandler
