import { categories } from './categories/categories.js'
import { comments } from './comments/comments.js'
import { posts } from './posts/posts.js'
import { relatedPost } from './related-post/related-post.js'
import { tagPost } from './tag-post/tag-post.js'
import { tags } from './tags/tags.js'

export const services = (app) => {
  app.configure(categories)

  app.configure(comments)

  app.configure(posts)

  app.configure(relatedPost)

  app.configure(tagPost)

  app.configure(tags)

  // All services will be registered here
}
