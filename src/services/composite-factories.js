import { createCategory } from './categories/categories.factory.js'
import { createPost } from './posts/posts.factory.js'
import { createTagPost } from './tag-post/tag-post.factory.js'
import { createTag } from './tags/tags.factory.js'

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

export async function createCategoryWithPosts({
  categoryAttributes = {},
  postsAttributes = []
} = {}) {
  const category = await createCategory(categoryAttributes)
  const posts = []

  for (const attributes of postsAttributes) {
    const post = await createPost({ category_id: category.id, ...attributes })
    posts.push(post)
  }

  return { category, posts }
}
