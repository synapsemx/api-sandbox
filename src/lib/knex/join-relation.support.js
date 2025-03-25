/**
 * @typedef {import("@feathersjs/feathers").Application} Application
 * @typedef {import('knex').Knex.QueryBuilder} QueryBuilder
 * @typedef {import('@types/relationships.js').RelationshipsMap} RelationshipsMap
 * @typedef {import('@types/relationships.js').RelationshipDefinition} RelationshipDefinition
 */

import { GeneralError } from '@feathersjs/errors'
import { buildRelationColumns } from './join-helpers.js'

class JoinRelationSupport {
  /**
   * @param {QueryBuilder} knex
   * @param {RelationshipsMap} relationships
   * @param {Application} app
   * @param {string} selfTableName
   */
  constructor(knex, relationships, app, selfTableName) {
    this.knex = knex
    this.relationships = relationships
    this.app = app
    this.selfTableName = selfTableName
  }

  /**
   * @param {QueryBuilder} builder
   * @param {string[]} relationKeys
   */
  applyJoins(builder, relationKeys = []) {
    for (const relationKey of relationKeys) {
      const relationDefinition = this.relationships[relationKey]
      relationDefinition.key = relationKey

      if (!relationDefinition) {
        continue
      }

      this.applyJoin(builder, relationDefinition)
    }
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  applyJoin(builder, relationDefinition) {
    const handlers = {
      belongsTo: this.joinBelongsTo.bind(this),
      hasMany: this.joinHasMany.bind(this),
      manyToMany: this.joinManyToMany.bind(this)
    }

    const handler = handlers[relationDefinition.type]

    if (!handler) {
      throw new GeneralError(
        `Unsupported relation type: ${relationDefinition.type}`
      )
    }

    handler(builder, relationDefinition)
  }

  /**
   * @param {RelationshipDefinition} relationDefinition
   */
  getRelationColumns(relationDefinition) {
    return buildRelationColumns(
      this.app,
      relationDefinition,
      this.selfTableName,

      { avoidTableConflicts: true }
    )
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinBelongsTo(builder, relationDefinition) {
    const { mainTableForeignKey, relatedTablePrimaryKey, safeJoinKey } =
      this.getRelationColumns(relationDefinition)

    builder.leftJoin(safeJoinKey, mainTableForeignKey, relatedTablePrimaryKey)
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinHasMany(builder, relationDefinition) {
    const { mainTablePrimaryKey, relatedTableForeignKey, safeJoinKey } =
      this.getRelationColumns(relationDefinition)

    builder.leftJoin(safeJoinKey, relatedTableForeignKey, mainTablePrimaryKey)
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinManyToMany(builder, relationDefinition) {
    const {
      pivotTableName,
      pivotTablePrimaryKey,
      pivotTableRelatedKey,
      mainTablePrimaryKey,
      relatedTablePrimaryKey,
      safeJoinKey
    } = this.getRelationColumns(relationDefinition)

    builder.leftJoin(pivotTableName, pivotTablePrimaryKey, mainTablePrimaryKey)
    builder.leftJoin(safeJoinKey, pivotTableRelatedKey, relatedTablePrimaryKey)
  }
}

export default JoinRelationSupport
