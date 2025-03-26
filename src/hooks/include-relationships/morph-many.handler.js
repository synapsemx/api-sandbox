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
 * Handles `morphMany` polymorphic relationships.
 *
 * @type {RelationshipHandler}
 */
const morphManyHandler = async (
  context,
  mainResources,
  existingRelations,
  relationName,
  relationshipDefinition,
  relationshipKey
) => {
  const { app, params, path: currentServiceName } = context
  const { service: serviceName, morphKey, morphType } = relationshipDefinition

  const mainIds = extractIds(mainResources)

  if (mainIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const relatedService = app.service(serviceName)

  const query = {
    [morphKey]: { $in: mainIds },
    [morphType]: currentServiceName
  }

  const relatedResources = await relatedService.find(
    buildServiceParams(params, query)
  )

  const updatedResources = mapOneToMany({
    relatedResources,
    mainResources,
    relatedForeignKey: morphKey,
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

export default morphManyHandler
