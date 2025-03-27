import { faker } from '@faker-js/faker'
import { createCategory } from '../src/services/categories/categories.factory.js'
import { createComment } from '../src/services/comments/comments.factory.js'
import { createPost } from '../src/services/posts/posts.factory.js'
import { postsPath } from '../src/services/posts/posts.shared.js'
import { createRelatedPost } from '../src/services/related-post/related-post.factory.js'
import { createTagPost } from '../src/services/tag-post/tag-post.factory.js'
import { createTag } from '../src/services/tags/tags.factory.js'

const times = async (callback, length) => {
  const result = []

  for (let i = 0; i < length; i++) {
    result.push(await callback(i))
  }

  return result
}

const seedDatabase = async () => {
  const categories = await times(createCategory, 3)
  const tags = await times(createTag, 8)
  const posts = await times(() => {
    return createPost({
      category_id: faker.helpers.arrayElement(categories).id
    })
  }, 10)

  for (const post of posts) {
    const tagsToAttach = faker.helpers.arrayElements(tags, 4)
    const postsToRelate = faker.helpers.arrayElements(posts, 2)

    for (const tag of tagsToAttach) {
      await createTagPost({ post_id: post.id, tag_id: tag.id })
    }

    for (const relatedPost of postsToRelate) {
      await createRelatedPost({
        post_id: post.id,
        related_post_id: relatedPost.id
      })
    }

    await times(
      () =>
        createComment({
          morph_id: post.id,
          morph_type: postsPath
        }),
      4
    )
  }

  process.exit(0)
}

seedDatabase()
