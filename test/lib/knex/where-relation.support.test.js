import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { createCategory } from '../../../src/services/categories/categories.factory.js'
import {
  createPostWithCategory,
  createPostWithParent,
  createPostWithRelatedPosts,
  createPostWithTags
} from '../../../src/services/composite-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'

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

  it('does not return results when $whereRelation (belongsTo) condition does not match', async () => {
    await createPostWithCategory({
      categoryAttributes: { name: 'Mismatch' }
    })

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          category: {
            'categories.name': 'Nonexistent'
          }
        }
      }
    })

    expect(posts.data.length).toBe(0)
  })

  it('does not return results when $whereRelation (hasMany) condition does not match', async () => {
    await createPostWithCategory()
    await createCategory()

    const categories = await app.service('categories').find({
      query: {
        $whereRelation: {
          posts: {
            'posts.content': 'Nonexistent'
          }
        }
      }
    })

    expect(categories.data.length).toBe(0)
  })

  it('does not return results when $whereRelation (manyToMany) condition does not match', async () => {
    await createPostWithTags({
      tagsAttributes: [{ name: 'Irrelevant' }]
    })

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          tags: {
            'tags.name': 'Nonexistent'
          }
        }
      }
    })

    expect(posts.data.length).toBe(0)
  })

  it('supports multiple $whereRelation conditions combined with $or', async () => {
    await createPostWithTags({ tagsAttributes: [{ name: 'Alpha' }] })
    await createPostWithTags({ tagsAttributes: [{ name: 'Beta' }] })
    const { post } = await createPostWithTags({
      tagsAttributes: [{ name: 'Gamma' }]
    })

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          tags: {
            $or: [{ 'tags.name': 'Gamma' }, { 'tags.name': 'Delta' }]
          }
        }
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
  })

  it('supports $whereRelation with multiple conditions on a single related record', async () => {
    const { post, tags } = await createPostWithTags({
      tagsAttributes: [{ name: 'TagX' }]
    })

    const [tag] = tags

    const posts = await app.service('posts').find({
      query: {
        $whereRelation: {
          tags: {
            'tags.name': tag.name,
            'tags.id': tag.id
          }
        }
      }
    })

    expect(posts.data.length).toBe(1)
    expect(posts.data[0].id).toBe(post.id)
  })

  it('supports $whereRelation on a self-referencing relationship (post → post)', async () => {
    const { post, parent } = await createPostWithParent()

    await times(createPostWithCategory, 3)

    const { data: posts } = await app.service('posts').find({
      query: {
        $whereRelation: {
          parent: {
            'parent.id': parent.id
          }
        }
      }
    })

    expect(posts.length).toBe(1)
    expect(posts[0].id).toBe(post.id)
    expect(posts[0].parent_id).toBe(parent.id)
  })

  it('supports $whereRelation on a self-referencing many-tom-many relationship (post ↔ post)', async () => {
    const { post } = await createPostWithRelatedPosts({
      relatedPostsAttributes: [{ content: 'target 1' }]
    })

    await times(createPostWithCategory, 3)

    const { data: posts } = await app.service('posts').find({
      query: {
        $whereRelation: {
          related_posts: {
            'related_posts.content': 'target 1'
          }
        }
      }
    })

    expect(posts.length).toBe(1)
    expect(posts[0].id).toBe(post.id)
  })
})
