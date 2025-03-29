/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 */

import hasManyHandler from './has-many.handler.js'
import {
  getResourceId,
  isProcessableMethod,
  shouldSkipRelationshipProcessing
} from './helpers.js'
import manyToManyHandler from './many-to-many.handler.js'

const handlers = {
  hasMany: hasManyHandler,
  manyToMany: manyToManyHandler
}

/**
 * @param {HookContext} context
 */
export default async function processRelationships(context) {
  const schema = context.self.options?.relationships
  const inbound = context.params.inboundRelationshipsToProcess || {}
  const resourceId = getResourceId(context)

  if (!schema || !isProcessableMethod(context.method)) {
    return context
  }

  for (const [name, definition] of Object.entries(schema)) {
    if (shouldSkipRelationshipProcessing(inbound, definition, name)) {
      continue
    }

    const handler = handlers[definition.type]
    await handler(context, definition, inbound[name], resourceId, name)
  }

  return context
}
