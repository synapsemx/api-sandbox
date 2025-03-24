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
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinBelongsTo(builder, relationDefinition) {
    const { mainTableForeignKey, relatedTablePrimaryKey, relatedTableName } =
      buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    builder.leftJoin(
      relatedTableName,
      mainTableForeignKey,
      relatedTablePrimaryKey
    )
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinHasMany(builder, relationDefinition) {
    const { mainTablePrimaryKey, relatedTableForeignKey, relatedTableName } =
      buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    builder.leftJoin(
      relatedTableName,
      relatedTableForeignKey,
      mainTablePrimaryKey
    )
  }

  /**
   * @param {QueryBuilder} builder
   * @param {RelationshipDefinition} relationDefinition
   */
  joinManyToMany(builder, relationDefinition) {
    const {
      relatedTableName,
      pivotTablePrimaryKey,
      pivotTableRelatedKey,
      mainTablePrimaryKey,
      relatedTablePrimaryKey
    } = buildRelationColumns(this.app, relationDefinition, this.selfTableName)

    builder.leftJoin(
      relationDefinition.pivot,
      pivotTablePrimaryKey,
      mainTablePrimaryKey
    )

    builder.leftJoin(
      relatedTableName,
      pivotTableRelatedKey,
      relatedTablePrimaryKey
    )
  }
}

export default JoinRelationSupport
