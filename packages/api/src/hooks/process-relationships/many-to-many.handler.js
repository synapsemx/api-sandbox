/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import('@types/relationships.js').RelationshipDefinition} RelationshipDefinition
 */
import { buildParams, buildQuery } from './helpers.js'

/**
 * @param {HookContext} context
 * @param {RelationshipDefinition} definition
 * @param {InboundResources} inbound
 * @param {string} resourceId
 * @param {string} relationName
 */
const manyToManyHandler = async (
  context,
  definition,
  inbound,
  resourceId,
  relationName
) => {
  const relatedService = context.app.service(definition.pivotService)
  const { primaryKey, relatedKey } = definition

  const existingPivots = await relatedService.find(
    buildQuery(context, {
      [primaryKey]: resourceId
    })
  )

  const toRemove = existingPivots.filter(
    (p) => !inbound.includes(p[relatedKey])
  )

  const toAdd = inbound.filter(
    (id) => !existingPivots.some((p) => p[relatedKey] === id)
  )

  if (toRemove.length > 0) {
    await relatedService.remove(
      null,
      buildParams(context, {
        query: { id: { $in: toRemove.map((p) => p.id) } },
        person: context.params.person
      })
    )
  }

  for (const id of toAdd) {
    await relatedService._create({
      [primaryKey]: resourceId,
      [relatedKey]: id
    })
  }
}

export default manyToManyHandler
