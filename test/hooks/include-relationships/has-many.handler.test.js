import { describe, expect, it } from 'vitest'
import { app } from '../../../src/app.js'
import { categoriesPath } from '../../../src/services/categories/categories.shared.js'
import { createCategoryWithPosts } from '../../../src/services/composite-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'
import { instantiateHttp, setupServer } from '../../helpers/http.js'

describe('Include Relationships hook - Has many handler', () => {
  setupServer()
  resetDatabaseUsingTransaction()

  it('should work in paginated resources', async () => {
    const http = instantiateHttp()

    const categories = await times(
      () =>
        createCategoryWithPosts({
          postsAttributes: [{}, {}, {}]
        }),
      2
    )

    const expectedPairs = categories.map(({ category, posts }) => ({
      categoryId: category.id,
      expectedPostIds: posts.map((p) => p.id)
    }))

    const { data: response } = await http.get('/categories?$include=posts')
    const { data: categoriesFromApi, relations } = response

    expect(categoriesFromApi).toHaveLength(2)
    expect(relations).toBeDefined()
    expect(Array.isArray(relations.posts)).toBe(true)
    expect(relations.posts).toHaveLength(6)

    for (const { categoryId, expectedPostIds } of expectedPairs) {
      const category = categoriesFromApi.find((c) => c.id === categoryId)

      expect(category).toBeDefined()
      expect(Array.isArray(category.posts)).toBe(true)
      expect(category.posts.sort()).toEqual(expectedPostIds.sort())
    }
  })

  it('should not include relations in non-paginated resources', async () => {
    await times(
      () =>
        createCategoryWithPosts({
          postsAttributes: [{}, {}, {}]
        }),
      2
    )

    const data = await app.service(categoriesPath).find({
      paginate: false
    })

    expect(data).toHaveLength(2)
    expect(data[0].relations).toBeUndefined()
  })

  it('should work in single resource', async () => {
    const http = instantiateHttp()

    const { category, posts } = await createCategoryWithPosts({
      postsAttributes: [{}, {}, {}]
    })

    const { data: resource } = await http.get(
      `/categories/${category.id}?$include=posts`
    )

    expect(Array.isArray(resource.posts)).toBe(true)
    expect(resource.posts.sort()).toEqual(posts.map((p) => p.id).sort())

    expect(resource.relations).toBeDefined()
    expect(Array.isArray(resource.relations.posts)).toBe(true)
    expect(resource.relations.posts).toHaveLength(3)

    for (const post of posts) {
      expect(resource.relations.posts.some((r) => r.id === post.id)).toBe(true)
    }
  })
})
