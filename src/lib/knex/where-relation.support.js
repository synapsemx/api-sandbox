/**
 * @typedef {import("@feathersjs/feathers").Application} Application
 * @typedef {import('knex').Knex.QueryBuilder} QueryBuilder
 * @typedef {import('@types/relationships.js').RelationshipsMap} RelationshipsMap
 * @typedef {import('@types/relationships.js').RelationshipDefinition} RelationshipDefinition
 */

import { getServiceTableName } from '../../utils/relationships.js'
import { buildRelationColumns } from './join-helpers.js'

class WhereRelationSupport {
  /**
   * @param {QueryBuilder} knex
   * @param {RelationshipsMap} relationships
   * @param {Application} app
   * @param {string} selfTableName
   * @param {Function} knexify
   */
  constructor(knex, relationships, app, selfTableName, knexify) {
    this.knex = knex
    this.relationships = relationships
    this.app = app
    this.selfTableName = selfTableName
    this.knexify = knexify
  }

  /**
   * @param {QueryBuilder} builder
   * @param {Record<string, unknown>} whereRelationDefinition
   */
  applyWhereConditions(builder, whereRelationDefinition) {
    for (const [relationName, relationQuery] of Object.entries(
      whereRelationDefinition
    )) {
      this.#applyRelationCondition(builder, relationName, relationQuery)
    }
  }

  /**
   * @param {QueryBuilder} builder
   * @param {string} relationName
   * @param {Record<string, unknown>} relationQuery
   */
  #applyRelationCondition(builder, relationName, relationQuery) {
    const relationDefinition = this.relationships[relationName]
    const relatedTableName = getServiceTableName(relationDefinition.service)

    const subquery = this.knex.from(relatedTableName).select('*')

    this.#addRelationJoinCondition(subquery, relationDefinition)
    this.knexify(subquery, relationQuery)

    builder.whereExists(subquery)
  }

  /**
   * @param {QueryBuilder} subquery
   * @param {RelationshipDefinition} relationDefinition
   */
  #addRelationJoinCondition(subquery, relationDefinition) {
    const handlers = {
      belongsTo: this.#addBelongsToCondition.bind(this),
      hasMany: this.#addHasManyCondition.bind(this),
      manyToMany: this.#addManyToManyCondition.bind(this)
    }

    const handler = handlers[relationDefinition.type]

    if (!handler) {
      throw new Error(`Unsupported relation type: ${relationDefinition.type}`)
    }

    handler(subquery, relationDefinition)
  }

  /**
   * @param {QueryBuilder} subquery
   * @param {RelationshipDefinition} relationDefinition
   */
  #addBelongsToCondition(subquery, relationDefinition) {
    const { mainTableForeignKey, relatedTablePrimaryKey } =
      buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    subquery.whereRaw(`${mainTableForeignKey} = ${relatedTablePrimaryKey}`)
  }

  /**
   * @param {QueryBuilder} subquery
   * @param {RelationshipDefinition} relationDefinition
   */
  #addHasManyCondition(subquery, relationDefinition) {
    const { mainTablePrimaryKey, relatedTableForeignKey } =
      buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    subquery.whereRaw(`${mainTablePrimaryKey} = ${relatedTableForeignKey}`)
  }

  /**
   * @param {QueryBuilder} subquery
   * @param {RelationshipDefinition} relationDefinition
   */
  #addManyToManyCondition(subquery, relationDefinition) {
    const {
      relatedTablePrimaryKey,
      mainTablePrimaryKey,
      pivotTablePrimaryKey,
      pivotTableRelatedKey
    } = buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    subquery
      .leftJoin(
        relationDefinition.pivot,
        pivotTableRelatedKey,
        relatedTablePrimaryKey
      )
      .whereRaw(`${pivotTablePrimaryKey} = ${mainTablePrimaryKey}`)
  }
}

export default WhereRelationSupport
