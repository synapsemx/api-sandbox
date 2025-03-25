import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { createCategory } from '../../../src/services/categories/categories.factory.js'
import {
  createPostWithCategory,
  createPostWithTags
} from '../../../src/services/posts/posts.factory.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'

describe('Knex Adapter Extended - Where Relationship Support', () => {
  resetDatabaseUsingTransaction()

  it('supports $whereRelation on a belongsTo relationship (post → category)', async () => {
    const targetCategoryName = 'Target Category'

    await createPostWithCategory()
    await createPostWithCategory()
    const { post, category } = await createPostWithCategory({
      categoryAttributes: { name: targetCategoryName }
    })

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          category: {
            'categories.name': targetCategoryName
          }
        }
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
    expect(posts.data[0].category_id).toBe(category.id)
  })

  it('supports $whereRelation on a hasMany relationship (category → posts)', async () => {
    const { category, post } = await createPostWithCategory()
    await createCategory()

    const categories = await app.service('categories').find({
      query: {
        $whereRelation: {
          posts: {
            'posts.id': post.id
          }
        }
      }
    })

    expect(categories.data.length).toBe(1)
    expect(categories.data[0].id).toBe(category.id)
  })

  it('supports $whereRelation on a manyToMany relationship (post ↔ tags)', async () => {
    await createPostWithTags({ tagsAttributes: [{ name: 'Common' }] })
    await createPostWithTags({ tagsAttributes: [{ name: 'Other' }] })
    const { post } = await createPostWithTags({
      tagsAttributes: [{ name: 'Target' }]
    })

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          tags: {
            'tags.name': 'Target'
          }
        }
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
  })
})
