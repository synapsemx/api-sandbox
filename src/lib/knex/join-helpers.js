import { getServiceTableName } from '../../utils/relationships.js'

/**
 * @param {import('@feathersjs/feathers').Application}
 * @param {import('@types/relationships').RelationshipDefinition} definition
 * @param {string} mainTableName
 */
export const buildRelationColumns = (app, definition, mainTableName) => {
  const relatedTableName = getServiceTableName(app, definition.service)

  const { pivotService, primaryKey, relatedKey, foreignKey } = definition

  const mainTablePrimaryKey = `${mainTableName}.id`
  const relatedTablePrimaryKey = `${relatedTableName}.id`

  const mainTableForeignKey = foreignKey
    ? `${mainTableName}.${foreignKey}`
    : null
  const relatedTableForeignKey = foreignKey
    ? `${relatedTableName}.${foreignKey}`
    : null

  const pivotTableName = pivotService
    ? getServiceTableName(app, pivotService)
    : null

  const pivotTablePrimaryKey = pivotService
    ? `${pivotTableName}.${primaryKey}`
    : null
  const pivotTableRelatedKey = pivotService
    ? `${pivotTableName}.${relatedKey}`
    : null

  return {
    relatedTableName,
    mainTablePrimaryKey,
    relatedTablePrimaryKey,
    mainTableForeignKey,
    relatedTableForeignKey,
    pivotTableName,
    pivotTablePrimaryKey,
    pivotTableRelatedKey
  }
}
