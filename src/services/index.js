import { comments } from './comments/comments.js'
import { tagPost } from './tag-post/tag-post.js'
import { posts } from './posts/posts.js'
import { tags } from './tags/tags.js'
import { categories } from './categories/categories.js'
export const services = app => {
  app.configure(comments)

  app.configure(tagPost)

  app.configure(posts)

  app.configure(tags)

  app.configure(categories)

  // All services will be registered here
}
