/**
 * @typedef {import("@feathersjs/feathers").HookContext} HookContext
 * @typedef {import('@types/relationships.js').RelationshipsMap} RelationshipsMap
 */
import { BadRequest } from '@feathersjs/errors'
import { pick } from '../utils/object.js'

/**
 * Parses the `$include` query parameter into an array of relationship keys.
 *
 * @param {HookContext} context
 * @returns {string[]}
 */
const parseIncludeQueryParam = ({ params: { query } }) => {
  const include = query?.$include

  if (!include) return []

  return typeof include === 'string' ? include.split(',') : include
}

/**
 * Returns the relationship definitions available for the current service.
 *
 * @param {HookContext} context
 * @returns {RelationshipsMap}
 */
const getServiceRelationships = (context) => {
  return context.self.options?.relationships || {}
}

/**
 * Validates that all requested relationships exist in the service definitions.
 *
 * @param {string[]} requestedRelationships
 * @param {RelationshipsMap} definedRelationships
 */
const assertValidRelationships = (
  requestedRelationships,
  definedRelationships
) => {
  const validKeys = Object.keys(definedRelationships)

  for (const key of requestedRelationships) {
    if (validKeys.includes(key)) continue

    throw new BadRequest(
      `Invalid relationship to include: "${key}". Valid relationships are: ${validKeys.join(', ')}.`
    )
  }
}

/**
 * Returns a map of relationship definitions to include based on `required` flags and user request.
 *
 * @param {RelationshipsMap} definedRelationships
 * @param {string[]} requestedRelationships
 * @returns {RelationshipsMap}
 */
const selectRelationshipsToInclude = (
  definedRelationships,
  requestedRelationships
) => {
  const requiredKeys = Object.entries(definedRelationships)
    .filter(([, def]) => def.required)
    .map(([key]) => key)

  return pick(definedRelationships, [
    ...requiredKeys,
    ...requestedRelationships
  ])
}

/**
 * Hook to process the `$include` query param and determine which relationships
 * should be eagerly loaded (appended) in the response. The resolved relationships
 * are stored in `context.params.includeRelationships`.
 *
 * @param {HookContext} context
 * @returns {HookContext}
 */
const processIncludeQuery = (context) => {
  const requestedRelationships = parseIncludeQueryParam(context)
  const definedRelationships = getServiceRelationships(context)

  if (requestedRelationships.length) {
    assertValidRelationships(requestedRelationships, definedRelationships)
  }

  context.params.includeRelationships = selectRelationshipsToInclude(
    definedRelationships,
    requestedRelationships
  )

  delete context.params?.query?.$include

  return context
}

export default processIncludeQuery
