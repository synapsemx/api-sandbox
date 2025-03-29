// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { relationshipTypes } from '../../utils/relationships.js'
import { dataValidator, queryValidator } from '../../validators.js'
import { postsPath } from '../posts/posts.shared.js'

// Main data model schema
export const commentsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    morph_type: Type.String(),
    morph_id: Type.String({ format: 'uuid' }),
    text: Type.String()
  },
  { $id: 'Comments', additionalProperties: false }
)
export const commentsValidator = getValidator(commentsSchema, dataValidator)
export const commentsResolver = resolve({})

export const commentsExternalResolver = resolve({})

// Schema for creating new entries
export const commentsDataSchema = Type.Pick(
  commentsSchema,
  ['morph_type', 'morph_id', 'content'],
  {
    $id: 'CommentsData'
  }
)
export const commentsDataValidator = getValidator(
  commentsDataSchema,
  dataValidator
)
export const commentsDataResolver = resolve({})

// Schema for updating existing entries
export const commentsPatchSchema = Type.Partial(commentsSchema, {
  $id: 'CommentsPatch'
})
export const commentsPatchValidator = getValidator(
  commentsPatchSchema,
  dataValidator
)
export const commentsPatchResolver = resolve({})

// Schema for allowed query properties
export const commentsQueryProperties = Type.Pick(commentsSchema, [
  'id',
  'morph_type',
  'morph_id',
  'content'
])
export const commentsQuerySchema = Type.Intersect(
  [
    querySyntax(commentsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: true }
)
export const commentsQueryValidator = getValidator(
  commentsQuerySchema,
  queryValidator
)
export const commentsQueryResolver = resolve({})

/**
 * @type {import('@types/relationships').RelationshipsMap}
 */
export const relationships = {
  post: {
    type: relationshipTypes.morphTo,
    service: postsPath,
    morphKey: 'morph_id',
    morphType: 'morph_type'
  }
}
