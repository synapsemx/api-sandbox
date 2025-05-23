// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { relationshipTypes } from '../../utils/relationships.js'
import { dataValidator, queryValidator } from '../../validators.js'
import { postsPath } from '../posts/posts.shared.js'

// Main data model schema
export const categoriesSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String()
  },
  { $id: 'Categories', additionalProperties: false }
)
export const categoriesValidator = getValidator(categoriesSchema, dataValidator)
export const categoriesResolver = resolve({})

export const categoriesExternalResolver = resolve({})

// Schema for creating new entries
export const categoriesDataSchema = Type.Pick(categoriesSchema, ['name'], {
  $id: 'CategoriesData'
})
export const categoriesDataValidator = getValidator(
  categoriesDataSchema,
  dataValidator
)
export const categoriesDataResolver = resolve({})

// Schema for updating existing entries
export const categoriesPatchSchema = Type.Partial(categoriesSchema, {
  $id: 'CategoriesPatch'
})
export const categoriesPatchValidator = getValidator(
  categoriesPatchSchema,
  dataValidator
)
export const categoriesPatchResolver = resolve({})

// Schema for allowed query properties
export const categoriesQueryProperties = Type.Pick(categoriesSchema, [
  'id',
  'name'
])
export const categoriesQuerySchema = Type.Intersect(
  [
    querySyntax(categoriesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: true }
)
export const categoriesQueryValidator = getValidator(
  categoriesQuerySchema,
  queryValidator
)
export const categoriesQueryResolver = resolve({})

/**
 * @type {import('@types/relationships').RelationshipsMap}
 */
export const relationships = {
  posts: {
    type: relationshipTypes.hasMany,
    service: postsPath,
    foreignKey: 'category_id'
  }
}
