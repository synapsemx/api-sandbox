import { describe, expect, it } from 'vitest'
import { createCommentWithPost } from '../../../src/services/compose-factories.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'
import { times } from '../../helpers/expects.js'
import { instantiateHttp, setupServer } from '../../helpers/http.js'

describe('Include Relationships hook - Morph to handler', () => {
  setupServer()
  resetDatabaseUsingTransaction()

  it('should include morphTo related post in paginated comments', async () => {
    const http = instantiateHttp()

    const commentsWithPosts = await times(() => createCommentWithPost(), 3)

    const expected = commentsWithPosts.map(({ comment, post }) => ({
      commentId: comment.id,
      postId: post.id
    }))

    const { data: response } = await http.get('/comments?$include=post')
    const { data: commentsFromApi, relations } = response

    expect(commentsFromApi).toHaveLength(3)
    expect(relations).toBeDefined()
    expect(Array.isArray(relations.posts)).toBe(true)
    expect(relations.posts).toHaveLength(3)

    for (const { commentId, postId } of expected) {
      const comment = commentsFromApi.find((c) => c.id === commentId)
      expect(comment).toBeDefined()
      expect(comment.post).toBe(postId)
    }
  })

  it('should include morphTo related post in single comment resource', async () => {
    const http = instantiateHttp()

    const { comment, post } = await createCommentWithPost()

    const { data: resource } = await http.get(
      `/comments/${comment.id}?$include=post`
    )

    expect(resource).toBeDefined()
    expect(resource.post).toBe(post.id)

    expect(resource.relations).toBeDefined()
    expect(Array.isArray(resource.relations.posts)).toBe(true)
    expect(resource.relations.posts).toHaveLength(1)
    expect(resource.relations.posts[0].id).toBe(post.id)
  })
})
