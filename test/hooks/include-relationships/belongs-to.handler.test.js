import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { createPostWithCategory } from '../../../src/services/posts/posts.factory.js'
import { postsPath } from '../../../src/services/posts/posts.shared.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'
import { instantiateHttp, setupServer } from '../../helpers/http.js'

describe('Include Relationships hook - Belongs to handler', () => {
  setupServer()
  resetDatabaseUsingTransaction()

  it('should work in paginated resources', async () => {
    const http = instantiateHttp()

    const posts = await times(createPostWithCategory, 3)

    const expectedPairs = posts.map(({ post, category }) => ({
      postId: post.id,
      expectedCategoryId: category.id
    }))

    const { data: response } = await http.get('/posts?$include=category')
    const { data: postsFromApi, relations } = response

    expect(postsFromApi).toHaveLength(3)
    expect(relations).toBeDefined()
    expect(Array.isArray(relations.categories)).toBe(true)
    expect(relations.categories).toHaveLength(3)

    for (const { postId, expectedCategoryId } of expectedPairs) {
      const apiPost = postsFromApi.find((p) => p.id === postId)

      expect(apiPost).toBeDefined()
      expect(apiPost.category).toBe(expectedCategoryId)
    }
  })

  it('should not include relations in non-paginated resources', async () => {
    await times(createPostWithCategory, 3)

    const data = await app.service(postsPath).find({
      paginate: false
    })

    expect(data).toHaveLength(3)
    expect(data[0].relations).toBeUndefined()
  })

  it('should work in single resource', async () => {
    const http = instantiateHttp()

    const { post, category } = await createPostWithCategory()

    const { data: resource } = await http.get(
      `/posts/${post.id}?$include=category`
    )

    expect(resource.category).toBe(post.category_id)
    expect(resource.relations).toBeDefined()
    expect(Array.isArray(resource.relations.categories)).toBe(true)
    expect(resource.relations.categories).toHaveLength(1)
    expect(resource.relations.categories[0].id).toBe(category.id)
  })
})
