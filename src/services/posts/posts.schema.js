// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const postsSchema = Type.Object(
  {
    id: Type.Number(),
    category_id: Type.String({ format: 'uuid' }),
    content: Type.String()
  },
  { $id: 'Posts', additionalProperties: false }
)
export const postsValidator = getValidator(postsSchema, dataValidator)
export const postsResolver = resolve({})

export const postsExternalResolver = resolve({})

// Schema for creating new entries
export const postsDataSchema = Type.Pick(
  postsSchema,
  ['category_id', 'content'],
  {
    $id: 'PostsData'
  }
)
export const postsDataValidator = getValidator(postsDataSchema, dataValidator)
export const postsDataResolver = resolve({})

// Schema for updating existing entries
export const postsPatchSchema = Type.Partial(postsSchema, {
  $id: 'PostsPatch'
})
export const postsPatchValidator = getValidator(postsPatchSchema, dataValidator)
export const postsPatchResolver = resolve({})

// Schema for allowed query properties
export const postsQueryProperties = Type.Pick(postsSchema, [
  'id',
  'category_id',
  'content'
])
export const postsQuerySchema = Type.Intersect(
  [
    querySyntax(postsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const postsQueryValidator = getValidator(
  postsQuerySchema,
  queryValidator
)
export const postsQueryResolver = resolve({})
