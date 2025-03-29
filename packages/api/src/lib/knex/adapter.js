/**
 * @typedef {import('@feathersjs/feathers').Application} Application
 * @typedef {import('knex').Knex.QueryBuilder} QueryBuilder
 * @typedef {import('@types/relationships.js').RelationshipsMap} RelationshipsMap
 * @typedef {import('@types/relationships.js').RelationshipDefinition} RelationshipDefinition
 */
import { KnexAdapter as BaseKnexAdapter } from '@feathersjs/knex'
import { pick } from '../../utils/object.js'
import JoinRelationSupport from './join-relation.support.js'
import WhereRelationSupport from './where-relation.support.js'

class KnexAdapter extends BaseKnexAdapter {
  /**
   * @type {Application}
   */
  app

  /**
   * @type {RelationshipsMap}
   */
  relationships

  constructor(options) {
    if (!options.app) {
      throw new Error('You must provide an Application')
    }

    if (!options?.Model) {
      throw new Error('You must provide a Model (the initialized knex object)')
    }

    if (typeof options.name !== 'string') {
      throw new Error('No table name specified.')
    }

    if (typeof options.relationships !== 'object') {
      throw new Error('No relationships specified.')
    }

    super({
      id: 'id',
      ...options,
      filters: {
        ...options.filters,
        $and: (value) => value
      },
      operators: [...(options.operators || []), '$like', '$notlike', '$ilike']
    })

    this.app = options.app
    this.relationships = options.relationships
  }

  /**
   * @param {Object} params
   * @returns {QueryBuilder}
   */
  createQuery(params = {}) {
    const { name: tableName, id: primaryKey } = this.getOptions(params)

    const { filters, query, joinRelation, whereRelation } =
      this.filterQueryWithRelations(params)

    const builder = this.db(params)

    this.selectColumns(builder, filters, tableName, primaryKey)
    this.addRelationJoins(builder, joinRelation)
    this.applyWhereConditionsForRelations(builder, whereRelation, params)
    this.applyQueryFilters(builder, query, filters)
    this.applySortOrders(builder, filters)

    return builder
  }

  /**
   * @param {Object} params
   */
  filterQueryWithRelations(params) {
    const query = { ...(params.query || {}) }
    const joinRelation = query.$joinRelation || []
    const whereRelation = query.$whereRelation || {}

    delete query.$joinRelation
    delete query.$whereRelation

    const filtered = super.filterQuery({ ...params, query })

    return {
      ...filtered,
      query: this.addTablePrefixToQuery(filtered.query),
      joinRelation,
      whereRelation
    }
  }

  /**
   * @param {QueryBuilder} builder
   * @param {Object} filters
   * @param {string} tableName
   * @param {string} primaryKey
   */
  selectColumns(builder, filters, tableName, primaryKey) {
    const hasCustomSelect = Array.isArray(filters.$select)

    if (hasCustomSelect) {
      const selectedColumns = filters.$select.map((column) =>
        column.includes('.') ? column : `${tableName}.${column}`
      )

      const columnsToSelect = new Set([
        ...selectedColumns,
        `${tableName}.${primaryKey}`
      ])

      builder.select(...columnsToSelect)
      return
    }

    builder.select(`${tableName}.*`)
  }

  /**
   * @param {QueryBuilder} builder
   * @param {Object} query
   * @param {Object} filters
   */
  applyQueryFilters(builder, query, filters) {
    const combined = {
      ...query,
      ...pick(filters, ['$and', '$or'])
    }

    this.knexify(builder, combined)
  }

  /**
   * @param {QueryBuilder} builder
   * @param {Object} filters
   */
  applySortOrders(builder, filters) {
    const sort = filters.$sort

    if (!sort) return

    for (const column of Object.keys(sort)) {
      const direction = sort[column] === 1 ? 'asc' : 'desc'

      builder.orderBy(column, direction)
    }
  }

  /**
   * @param {QueryBuilder} builder
   * @param {string[]} relationKeys
   */
  addRelationJoins(builder, relationKeys = []) {
    const joinRelationSupport = new JoinRelationSupport(
      this.knex,
      this.relationships,
      this.app,
      this.options.name
    )

    joinRelationSupport.applyJoins(builder, relationKeys)
  }

  /**
   * @param {Object} query
   * @returns {Object}
   */
  addTablePrefixToQuery(query) {
    const table = this.options.name
    const output = {}

    const excludedKeys = [
      '$and',
      '$or',
      '$ne',
      '$in',
      '$nin',
      '$lt',
      '$lte',
      '$gt',
      '$gte',
      '$like',
      '$notlike',
      '$ilike'
    ]

    for (const key in query) {
      if (excludedKeys.includes(key)) {
        output[key] = query[key]

        continue
      }

      const fullKey = key.includes('.') ? key : `${table}.${key}`

      output[fullKey] = query[key]
    }

    return output
  }

  /**
   * @param {QueryBuilder} builder
   * @param {Record<string, unknown>} whereRelation
   * @param {Record<string, unknown>} params
   */
  applyWhereConditionsForRelations(builder, whereRelation, params) {
    const { Model } = this.getOptions(params)

    const relationSupport = new WhereRelationSupport(
      Model,
      this.options.relationships,
      this.app,
      this.options.name,
      this.knexify
    )

    relationSupport.applyWhereConditions(builder, whereRelation)
  }
}

export default KnexAdapter
