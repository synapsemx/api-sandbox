/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import("@feathersjs/feathers").Service} Service
 * @typedef {import('@types/relationships.js').RelationshipDefinition} RelationshipDefinition
 */

import { buildParams, buildQuery } from './helpers.js'

/**
 * @param {HookContext} context
 * @param {Service} service
 * @param {string} foreignKey
 * @param {string[]} ids
 * @param {string|null} value
 * @returns {Promise<void>}
 */
const updateResourceLinks = async (
  context,
  service,
  foreignKey,
  ids,
  value
) => {
  await service._patch(
    null,
    { [foreignKey]: value },
    buildParams(context, {
      query: { id: { $in: ids } }
    })
  )
}
/**
 * @param {HookContext} context
 * @param {RelationshipDefinition} definition
 * @param {InboundResources} inboundResources
 * @param {string} resourceId
 * @param {string} relationName
 */
const hasManyHandler = async (
  context,
  definition,
  inboundResources,
  resourceId,
  relationName
) => {
  const relatedService = context.app.service(definition.service)
  const foreignKey = definition.foreignKey

  const currentResources = (
    await relatedService.find(buildQuery(context, { [foreignKey]: resourceId }))
  ).map((r) => r.id)

  const toRemove = currentResources.filter(
    (id) => !inboundResources.includes(id)
  )
  const toAdd = inboundResources.filter((id) => !currentResources.includes(id))

  if (toAdd.length > 0) {
    await updateResourceLinks(
      context,
      relatedService,
      foreignKey,
      toAdd,
      resourceId
    )
  }

  if (toRemove.length > 0) {
    await updateResourceLinks(
      context,
      relatedService,
      foreignKey,
      toRemove,
      null
    )
  }
}

export default hasManyHandler
