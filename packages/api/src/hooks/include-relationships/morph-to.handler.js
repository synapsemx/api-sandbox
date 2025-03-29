/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@types/include-relationships.js").RelationshipHandler} RelationshipHandler
 */

import { extractIds, getServiceTableName } from '../../utils/relationships.js'
import {
  buildServiceParams,
  mapOneToOne,
  pushIntoRelations
} from './helpers.js'

/**
 * Groups resources by the value of the given morph type key.
 *
 * @param {Record<string, unknown>[]} resources
 * @param {string} morphTypeKey
 * @returns {Record<string, Record<string, unknown>[]>}
 */
const groupByMorphType = (resources, morphTypeKey) =>
  resources.reduce((groupedResources, resource) => {
    const type = resource[morphTypeKey]

    if (!groupedResources[type]) {
      groupedResources[type] = []
    }

    groupedResources[type].push(resource)

    return groupedResources
  }, {})

/**
 * Processes a morph group by loading related resources and attaching them to main resources.
 *
 * @param {HookContext} context
 * @param {string} serviceName
 * @param {Record<string, unknown>[]} groupResources
 * @param {string} morphKey
 * @param {string} relationKey
 * @param {Record<string, Record<string, unknown>[]>} currentRelations
 * @returns {Promise<{ resources: Record<string, unknown>[], relations: Record<string, Record<string, unknown>[]> }>}
 */
const processMorphGroup = async (
  context,
  serviceName,
  groupResources,
  morphKey,
  relationKey,
  currentRelations
) => {
  const { app, params } = context
  const relatedService = app.service(serviceName)
  const tableName = getServiceTableName(app, serviceName)
  const relatedResourceIds = extractIds(groupResources, morphKey)

  if (relatedResourceIds.length === 0) {
    return { resources: groupResources, relations: currentRelations }
  }

  const relatedResources = await relatedService.find(
    buildServiceParams(params, { id: { $in: relatedResourceIds } })
  )

  const enrichedGroupResources = mapOneToOne({
    relatedResources,
    mainResources: groupResources,
    relatedForeignKey: 'id',
    mainPrimaryKey: morphKey,
    relationKey
  })

  const updatedRelations = pushIntoRelations({
    relationKey: tableName,
    newRelatedItems: relatedResources,
    relations: currentRelations
  })

  return {
    resources: enrichedGroupResources,
    relations: updatedRelations
  }
}

/**
 * Handles `morphTo` polymorphic relationships.
 *
 * @type {RelationshipHandler}
 */
const morphToHandler = async (
  context,
  mainResources,
  existingRelations,
  relationKey,
  relationshipDefinition
) => {
  const { morphType, morphKey } = relationshipDefinition
  const groupedResources = groupByMorphType(mainResources, morphType)

  let allUpdatedResources = []
  let allUpdatedRelations = existingRelations

  for (const [serviceName, groupResources] of Object.entries(
    groupedResources
  )) {
    const { resources, relations } = await processMorphGroup(
      context,
      serviceName,
      groupResources,
      morphKey,
      relationKey,
      allUpdatedRelations
    )

    allUpdatedResources = [...allUpdatedResources, ...resources]
    allUpdatedRelations = relations
  }

  return {
    updatedResources: allUpdatedResources,
    updatedRelations: allUpdatedRelations
  }
}

export default morphToHandler
