import { createCategory } from './categories/categories.factory.js'
import { createComment } from './comments/comments.factory.js'
import { createPost } from './posts/posts.factory.js'
import { postsPath } from './posts/posts.shared.js'
import { createRelatedPost } from './related-post/related-post.factory.js'
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

export async function createPostWithParent({
  attributes = {},
  parentAttributes = {},
  categoryAttributes = {}
} = {}) {
  const category = await createCategory(categoryAttributes)
  const parent = await createPost({
    category_id: category.id,
    ...parentAttributes
  })

  const post = await createPost({
    category_id: category.id,
    parent_id: parent.id,
    ...attributes
  })

  return { parent, post, category }
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

export async function createPostWithRelatedPosts({
  attributes = {},
  categoryAttributes = {},
  relatedPostsAttributes = []
} = {}) {
  const { post, category } = await createPostWithCategory({
    attributes,
    categoryAttributes
  })
  const relatedPosts = []

  for (const attributes of relatedPostsAttributes) {
    const relatedPost = await createPost({
      category_id: category.id,
      ...attributes
    })

    await createRelatedPost({
      post_id: post.id,
      related_post_id: relatedPost.id
    })

    relatedPosts.push(relatedPost)
  }

  return { post, category, relatedPosts }
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

export const createPostWithComments = async ({
  postAttributes = {},
  categoryAttributes = {},
  commentsAttributes = [{}, {}, {}]
} = {}) => {
  const { post, category } = await createPostWithCategory({
    attributes: postAttributes,
    categoryAttributes
  })
  const comments = []

  for (const attributes of commentsAttributes) {
    const comment = await createComment({
      morph_type: postsPath,
      morph_id: post.id,
      ...attributes
    })

    comments.push(comment)
  }

  return { post, category, comments }
}
