import { describe, expect, it } from 'vitest'
import { createPostWithComments } from '../../../src/services/compose-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'
import { instantiateHttp, setupServer } from '../../helpers/http.js'

describe('Include Relationships hook - Morph many handler', () => {
  setupServer()
  resetDatabaseUsingTransaction()

  it('should include morphMany related comments in paginated resources', async () => {
    const http = instantiateHttp()

    const posts = await times(() => createPostWithComments(), 2)

    const expected = posts.map(({ post, comments }) => ({
      postId: post.id,
      commentIds: comments.map((c) => c.id)
    }))

    const { data: response } = await http.get('/posts?$include=comments')
    const { data: postsFromApi, relations } = response

    expect(postsFromApi).toHaveLength(2)
    expect(relations).toBeDefined()
    expect(Array.isArray(relations.comments)).toBe(true)
    expect(relations.comments).toHaveLength(6)

    for (const { postId, commentIds } of expected) {
      const post = postsFromApi.find((p) => p.id === postId)
      expect(post).toBeDefined()
      expect(Array.isArray(post.comments)).toBe(true)
      expect(post.comments.sort()).toEqual(commentIds.sort())
    }
  })

  it('should work in single resource', async () => {
    const http = instantiateHttp()

    const { post, comments } = await createPostWithComments()

    const { data: resource } = await http.get(
      `/posts/${post.id}?$include=comments`
    )

    expect(Array.isArray(resource.comments)).toBe(true)
    expect(resource.comments.sort()).toEqual(comments.map((c) => c.id).sort())

    expect(resource.relations).toBeDefined()
    expect(Array.isArray(resource.relations.comments)).toBe(true)
    expect(resource.relations.comments).toHaveLength(3)

    for (const comment of comments) {
      expect(resource.relations.comments.some((r) => r.id === comment.id)).toBe(
        true
      )
    }
  })
})
