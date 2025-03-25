/**
 * @typedef {import('@feathersjs/feathers').Application} Application
 * @typedef {import('@types/relationships').RelationshipDefinition} RelationshipDefinition
 */
import { getServiceTableName } from '../../utils/relationships.js'
import { toSnakeCase } from '../../utils/string.js'

/**
 * @param {string} mainTableName
 * @param {string} relatedTableName
 * @param {RelationshipDefinition} definition
 * @param {*} definition
 */
const resolveAliasTableName = (mainTableName, relatedTableName, definition) => {
  if (mainTableName !== relatedTableName) {
    return relatedTableName
  }

  if (definition.key) {
    return toSnakeCase(definition.key)
  }

  return `alias_${relatedTableName}`
}

/**
 * @param {Application} app
 * @param {RelationshipDefinition} definition
 * @param {string} mainTableName
 * @param {object} [options]
 * @param {boolean} [options.avoidTableConflicts=false]
 */
export const buildRelationColumns = (
  app,
  definition,
  mainTableName,
  { avoidTableConflicts = false } = {}
) => {
  const relatedTableName = getServiceTableName(app, definition.service)
  const relatedAliasTableName = resolveAliasTableName(
    mainTableName,
    relatedTableName,
    definition
  )
  const safeJoinKey =
    mainTableName === relatedTableName
      ? `${relatedTableName} as ${relatedAliasTableName}`
      : relatedAliasTableName

  const { pivotService, primaryKey, relatedKey, foreignKey } = definition

  const mainTablePrimaryKey = `${mainTableName}.id`
  const relatedTablePrimaryKey = `${relatedAliasTableName}.id`

  const mainTableForeignKey = foreignKey
    ? `${mainTableName}.${foreignKey}`
    : null
  const relatedTableForeignKey = foreignKey
    ? `${relatedAliasTableName}.${foreignKey}`
    : null

  let pivotTableName = pivotService
    ? getServiceTableName(app, pivotService)
    : null

  if (avoidTableConflicts && pivotTableName === mainTableName) {
    pivotTableName = `alias_${pivotTableName}`
  }

  const pivotTablePrimaryKey = pivotService
    ? `${pivotTableName}.${primaryKey}`
    : null
  const pivotTableRelatedKey = pivotService
    ? `${pivotTableName}.${relatedKey}`
    : null

  return {
    relatedTableName: relatedAliasTableName,
    originalRelatedTableName: relatedTableName,
    safeJoinKey,
    mainTablePrimaryKey,
    relatedTablePrimaryKey,
    mainTableForeignKey,
    relatedTableForeignKey,
    pivotTableName,
    pivotTablePrimaryKey,
    pivotTableRelatedKey
  }
}
