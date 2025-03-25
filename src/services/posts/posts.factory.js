import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { createCategory } from '../categories/categories.factory.js'
import { createTagPost } from '../tag-post/tag-post.factory.js'
import { createTag } from '../tags/tags.factory.js'
import { postsTable } from './posts.shared.js'

export function generatePost(attributes = {}) {
  return {
    id: faker.string.uuid(),
    category_id: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    ...attributes
  }
}

export function createPost(attributes = {}) {
  return insert(generatePost(attributes), postsTable)
}

export async function createPostWithCategory({
  attributes = {},
  categoryAttributes = {}
} = {}) {
  const category = await createCategory(categoryAttributes)
  const post = await createPost({ category_id: category.id, ...attributes })

  return { category, post }
}

export async function createPostWithTags({
  attributes = {},
  categoryAttributes = {},
  tagsAttributes = []
} = {}) {
  const { post, category } = await createPostWithCategory({
    attributes,
    categoryAttributes
  })
  const tags = []

  for (const tagAttributes of tagsAttributes) {
    const tag = await createTag(tagAttributes)

    await createTagPost({ post_id: post.id, tag_id: tag.id })

    tags.push(tag)
  }

  return { post, category, tags }
}
