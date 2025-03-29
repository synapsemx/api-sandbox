/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */

import { extractIds } from '../../utils/relationships.js'
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

  const relatedIds = extractIds(mainResources, foreignKey)

  if (relatedIds.length === 0) {
    return {
      updatedResources: mainResources,
      updatedRelations: existingRelations
    }
  }

  const relatedService = app.service(serviceName)
  const query = {
    id: { $in: relatedIds }
  }
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

export default belongsToHandler
