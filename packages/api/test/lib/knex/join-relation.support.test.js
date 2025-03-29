import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { createCategory } from '../../../src/services/categories/categories.factory.js'
import {
  createPostWithCategory,
  createPostWithParent,
  createPostWithRelatedPosts,
  createPostWithTags
} from '../../../src/services/compose-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'

describe('Knex Adapter Extended - Join Relationship Support', () => {
  resetDatabaseUsingTransaction()

  it('performs a join on a belongsTo relationship (post → category)', async () => {
    const targetCategoryName = 'Target Category'

    await createPostWithCategory()
    await createPostWithCategory()
    const { category } = await createPostWithCategory({
      categoryAttributes: { name: targetCategoryName }
    })

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
    const { category, post } = await createPostWithCategory()

    await createCategory()

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
    await createPostWithTags({ tagsAttributes: [{ name: 'Common' }] })
    await createPostWithTags({ tagsAttributes: [{ name: 'Other' }] })
    const { post } = await createPostWithTags({
      tagsAttributes: [{ name: 'Target' }]
    })

    const posts = await app.service('posts').find({
      query: {
        $joinRelation: ['tags'],
        'tags.name': 'Target'
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
  })

  it('performs a join on a self-referencing belongs-to relationship (post → post)', async () => {
    const { post, parent } = await createPostWithParent()

    await times(createPostWithCategory, 3)

    const { data: posts } = await app.service('posts').find({
      query: {
        $joinRelation: ['parent'],
        'parent.id': parent.id
      }
    })

    expect(posts.length).toBe(1)
    expect(posts[0].id).toBe(post.id)
    expect(posts[0].parent_id).toBe(parent.id)
  })

  it('performs a join on a self-referencing many-tom-many relationship (post ↔ post)', async () => {
    const { post } = await createPostWithRelatedPosts({
      relatedPostsAttributes: [{ content: 'target 1' }]
    })

    await times(createPostWithCategory, 3)

    const { data: posts } = await app.service('posts').find({
      query: {
        $joinRelation: ['related_posts'],
        'related_posts.content': 'target 1'
      }
    })

    expect(posts.length).toBe(1)
    expect(posts[0].id).toBe(post.id)
  })
})
