import { getServiceTableName } from '../../utils/relationships.js'

/**
 * @param {import('@feathersjs/feathers').Application}
 * @param {import('@types/relationships').RelationshipDefinition} definition
 * @param {string} mainTableName
 */
export const buildRelationColumns = (app, definition, mainTableName) => {
  const relatedTableName = getServiceTableName(app, definition.service)

  const { pivot, primaryKey, relatedKey, foreignKey } = definition

  /**
   * @type {Record<string, string|null>}
   */
  const columns = {
    mainTablePrimaryKey: `${mainTableName}.id`,
    relatedTablePrimaryKey: `${relatedTableName}.id`,
    relatedTableName
  }

  if (pivot) {
    columns.pivotTablePrimaryKey = `${pivot}.${primaryKey}`
    columns.pivotTableRelatedKey = `${pivot}.${relatedKey}`
  } else {
    columns.pivotTablePrimaryKey = null
    columns.pivotTableRelatedKey = null
  }

  if (foreignKey) {
    columns.mainTableForeignKey = `${mainTableName}.${foreignKey}`
    columns.relatedTableForeignKey = `${relatedTableName}.${foreignKey}`
  } else {
    columns.mainTableForeignKey = null
    columns.relatedTableForeignKey = null
  }

  console.log(columns)

  return columns
}
