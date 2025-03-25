// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const relatedPostSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    post_id: Type.String({ format: 'uuid' }),
    related_post_id: Type.String({ format: 'uuid' })
  },
  { $id: 'RelatedPost', additionalProperties: false }
)
export const relatedPostValidator = getValidator(
  relatedPostSchema,
  dataValidator
)
export const relatedPostResolver = resolve({})

export const relatedPostExternalResolver = resolve({})

// Schema for creating new entries
export const relatedPostDataSchema = Type.Pick(
  relatedPostSchema,
  ['post_id', 'related_post_id'],
  {
    $id: 'RelatedPostData'
  }
)
export const relatedPostDataValidator = getValidator(
  relatedPostDataSchema,
  dataValidator
)
export const relatedPostDataResolver = resolve({})

// Schema for updating existing entries
export const relatedPostPatchSchema = Type.Partial(relatedPostSchema, {
  $id: 'RelatedPostPatch'
})
export const relatedPostPatchValidator = getValidator(
  relatedPostPatchSchema,
  dataValidator
)
export const relatedPostPatchResolver = resolve({})

// Schema for allowed query properties
export const relatedPostQueryProperties = Type.Pick(relatedPostSchema, [
  'id',
  'post_id',
  'related_post_id'
])
export const relatedPostQuerySchema = Type.Intersect(
  [
    querySyntax(relatedPostQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: true }
)
export const relatedPostQueryValidator = getValidator(
  relatedPostQuerySchema,
  queryValidator
)
export const relatedPostQueryResolver = resolve({})
