// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const tagPostSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    tag_id: Type.String({ format: 'uuid' }),
    post_id: Type.String({ format: 'uuid' })
  },
  { $id: 'TagPost', additionalProperties: false }
)
export const tagPostValidator = getValidator(tagPostSchema, dataValidator)
export const tagPostResolver = resolve({})

export const tagPostExternalResolver = resolve({})

// Schema for creating new entries
export const tagPostDataSchema = Type.Pick(
  tagPostSchema,
  ['tag_id', 'post_id'],
  {
    $id: 'TagPostData'
  }
)
export const tagPostDataValidator = getValidator(
  tagPostDataSchema,
  dataValidator
)
export const tagPostDataResolver = resolve({})

// Schema for updating existing entries
export const tagPostPatchSchema = Type.Partial(tagPostSchema, {
  $id: 'TagPostPatch'
})
export const tagPostPatchValidator = getValidator(
  tagPostPatchSchema,
  dataValidator
)
export const tagPostPatchResolver = resolve({})

// Schema for allowed query properties
export const tagPostQueryProperties = Type.Pick(tagPostSchema, [
  'id',
  'tag_id',
  'post_id'
])
export const tagPostQuerySchema = Type.Intersect(
  [
    querySyntax(tagPostQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: true }
)
export const tagPostQueryValidator = getValidator(
  tagPostQuerySchema,
  queryValidator
)
export const tagPostQueryResolver = resolve({})
