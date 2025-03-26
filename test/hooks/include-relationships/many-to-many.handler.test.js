import { describe, it } from 'vitest'
import {
  createPostWithRelatedPosts,
  createPostWithTags
} from '../../../src/services/compose-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { instantiateHttp, setupServer } from '../../helpers/http.js'

describe('Include Relationships hook - Many to many handler', () => {
  setupServer()
  resetDatabaseUsingTransaction()

  it('should include many-to-many related resources (tags)', async () => {
    const http = instantiateHttp()

    const { post, tags } = await createPostWithTags({
      tagsAttributes: [{}, {}, {}]
    })

    const { data: response } = await http.get('/posts?$include=tags')
    const postFromApi = response.data.find((p) => p.id === post.id)

    expect(postFromApi).toBeDefined()
    expect(Array.isArray(postFromApi.tags)).toBe(true)
    expect(postFromApi.tags.sort()).toEqual(tags.map((t) => t.id).sort())

    expect(response.relations).toBeDefined()
    expect(Array.isArray(response.relations.tags)).toBe(true)
    expect(response.relations.tags).toHaveLength(3)

    for (const tag of tags) {
      expect(response.relations.tags.some((t) => t.id === tag.id)).toBe(true)
    }
  })

  it('should include self-referencing many-to-many relationship (post ↔ post)', async () => {
    const http = instantiateHttp()

    const { post, relatedPosts } = await createPostWithRelatedPosts({
      relatedPostsAttributes: [{}, {}, {}]
    })

    const { data: response } = await http.get('/posts?$include=related_posts')
    const postFromApi = response.data.find((p) => p.id === post.id)

    expect(postFromApi).toBeDefined()
    expect(Array.isArray(postFromApi.related_posts)).toBe(true)
    expect(postFromApi.related_posts.sort()).toEqual(
      relatedPosts.map((p) => p.id).sort()
    )

    expect(response.relations).toBeDefined()
    expect(Array.isArray(response.relations.posts)).toBe(true)
    expect(response.relations.posts).toHaveLength(3)

    for (const relatedPost of relatedPosts) {
      expect(
        response.relations.posts.some((p) => p.id === relatedPost.id)
      ).toBe(true)
    }
  })
})
