/**
 * @typedef {Record<string, unknown>} Resource
 */
import pluralize from 'pluralize'
import { toSnakeCase } from '../../utils/string.js'

/**
 * Generates a consistent relationship key name from a service name.
 *
 * @param {string} serviceName
 * @returns {string}
 */
export const relationshipKeyName = (serviceName = '') =>
  toSnakeCase(pluralize(serviceName))

/**
 * Builds standard params for relationship service calls.
 *
 * @param {Resource} params
 * @param {Resource} query
 */
export const buildServiceParams = (params, query) => ({
  query: { ...query, $limit: 1000 },
  paginate: false,
  internal: true
})

/**
 * Pairs a single related resource to each main resource (1:1 relationship).
 *
 * @param {object} params
 * @param {Resource[]} params.relatedResources
 * @param {Resource[]} params.mainResources
 * @param {string} params.relatedForeignKey
 * @param {string} params.mainPrimaryKey
 * @param {string} params.relationKey
 * @param {string} [params.relatedIdKey='id']
 * @returns {Resource[]}
 */
export const mapOneToOne = ({
  relatedResources,
  mainResources,
  relatedForeignKey,
  mainPrimaryKey,
  relationKey,
  relatedIdKey = 'id'
}) => {
  const relationMap = relatedResources.reduce((map, resource) => {
    map.set(resource[relatedForeignKey], resource[relatedIdKey])
    return map
  }, new Map())

  return mainResources.map((resource) => ({
    ...resource,
    [relationKey]: relationMap.get(resource[mainPrimaryKey])
  }))
}

/**
 * Pairs multiple related resources to each main resource (1:N relationship).
 *
 * @param {object} params
 * @param {Resource[]} params.relatedResources
 * @param {Resource[]} params.mainResources
 * @param {string} params.relatedForeignKey
 * @param {string} params.mainPrimaryKey
 * @param {string} params.relationKey
 * @returns {Resource[]}
 */
export const mapOneToMany = ({
  relatedResources,
  mainResources,
  relatedForeignKey,
  mainPrimaryKey,
  relationKey
}) => {
  const groupedMap = new Map(
    mainResources.map((res) => [res[mainPrimaryKey], []])
  )

  for (const resource of relatedResources) {
    groupedMap.get(resource[relatedForeignKey])?.push(resource.id)
  }

  return mainResources.map((resource) => ({
    ...resource,
    [relationKey]: groupedMap.get(resource[mainPrimaryKey])
  }))
}

/**
 * Pushes a new batch of related records into the `relations` object.
 *
 * @param {object} params
 * @param {string} params.relationKey
 * @param {Resource[]} params.newRelatedItems
 * @param {Record<string, Resource[]>} params.relations
 * @returns {Record<string, Resource[]>}
 */
export const pushIntoRelations = ({
  relationKey,
  newRelatedItems,
  relations
}) => {
  relations[relationKey] = [...relations[relationKey], ...newRelatedItems]
  return relations
}

/**
 * Filters out empty or invalid relation entries, ensuring uniqueness by `id`.
 *
 * @param {object} params
 * @param {Record<string, Resource[]>} params.relations
 * @returns {Record<string, Resource[]>}
 */
export const filterRelationsByUnique = ({ relations }) => {
  return Object.entries(relations)
    .filter(([key, value]) => key && value.length)
    .reduce((acc, [key, value]) => {
      acc[key] = value.filter((item) => item.id)
      return acc
    }, {})
}
