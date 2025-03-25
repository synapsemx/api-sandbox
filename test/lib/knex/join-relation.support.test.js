import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { createCategory } from '../../../src/services/categories/categories.factory.js'
import { createPost } from '../../../src/services/posts/posts.factory.js'
import { createTagPost } from '../../../src/services/tag-post/tag-post.factory.js'
import { createTag } from '../../../src/services/tags/tags.factory.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'

describe('Knex Adapter Extended - Join Relationship Support', () => {
  resetDatabaseUsingTransaction()

  const createPostWithCategory = async (categoryName = null) => {
    const category = await createCategory(
      categoryName ? { name: categoryName } : {}
    )
    const post = await createPost({ category_id: category.id })

    return { category, post }
  }

  const createPostWithTags = async (tagNames = []) => {
    const { post } = await createPostWithCategory()
    const tags = await Promise.all(tagNames.map((name) => createTag({ name })))

    await Promise.all(
      tags.map((tag) => createTagPost({ post_id: post.id, tag_id: tag.id }))
    )

    return { post, tags }
  }

  it('performs a join on a belongsTo relationship (post → category)', async () => {
    const targetCategoryName = 'Target Category'

    await createPostWithCategory()
    await createPostWithCategory()
    const { category } = await createPostWithCategory(targetCategoryName)

    const posts = await app.service('posts').find({
      query: {
        $joinRelation: ['category'],
        'categories.name': targetCategoryName
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].category_id).toBe(category.id)
  })

  it('performs a join on a hasMany relationship (category → posts)', async () => {
    const { category, post } = await createPostWithCategory('With Post')

    await createCategory({ name: 'Without Post' })

    const categories = await app.service('categories').find({
      query: {
        $joinRelation: ['posts'],
        'posts.id': post.id
      }
    })

    expect(categories.data.length).toBe(1)
    expect(categories.data[0].id).toBe(category.id)
  })

  it('performs a join on a manyToMany relationship (post ↔ tags)', async () => {
    await createPostWithTags(['Common'])
    await createPostWithTags(['Other'])
    const { post } = await createPostWithTags(['Target'])

    const posts = await app.service('posts').find({
      query: {
        $joinRelation: ['tags'],
        'tags.name': 'Target'
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
  })
})
