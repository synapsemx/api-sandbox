// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { relationshipTypes } from '../../utils/relationships.js'
import { dataValidator, queryValidator } from '../../validators.js'
import { postsPath } from '../posts/posts.shared.js'

// Main data model schema
export const tagsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String()
  },
  { $id: 'Tags', additionalProperties: false }
)
export const tagsValidator = getValidator(tagsSchema, dataValidator)
export const tagsResolver = resolve({})

export const tagsExternalResolver = resolve({})

// Schema for creating new entries
export const tagsDataSchema = Type.Pick(tagsSchema, ['name'], {
  $id: 'TagsData'
})
export const tagsDataValidator = getValidator(tagsDataSchema, dataValidator)
export const tagsDataResolver = resolve({})

// Schema for updating existing entries
export const tagsPatchSchema = Type.Partial(tagsSchema, {
  $id: 'TagsPatch'
})
export const tagsPatchValidator = getValidator(tagsPatchSchema, dataValidator)
export const tagsPatchResolver = resolve({})

// Schema for allowed query properties
export const tagsQueryProperties = Type.Pick(tagsSchema, ['id', 'name'])
export const tagsQuerySchema = Type.Intersect(
  [
    querySyntax(tagsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: true }
)
export const tagsQueryValidator = getValidator(tagsQuerySchema, queryValidator)
export const tagsQueryResolver = resolve({})

/**
 * @type {import('@types/relationships').RelationshipsMap}
 */
export const relationships = {
  posts: {
    type: relationshipTypes.hasMany,
    service: postsPath,
    primaryKey: 'tag_id',
    relatedKey: 'post_id'
  }
}
