import { describe } from 'vitest'
import { app } from '../../../src/app.js'
import { createCategory } from '../../../src/services/categories/categories.factory.js'
import { createPost } from '../../../src/services/posts/posts.factory.js'
import { resetDatabaseUsingTransaction } from '../../helpers/db.js'

describe('extended knex adapter', () => {
  resetDatabaseUsingTransaction()

  const createPostWithCategory = async (categoryName = null) => {
    const category = await createCategory(
      categoryName ? { name: categoryName } : {}
    )
    const post = await createPost({ category_id: category.id })

    return { category, post }
  }

  it('should be able to use $joinRelation query param', async () => {
    const targetCateogryName = 'Test Category'

    await createPostWithCategory()
    await createPostWithCategory()
    const { category, post } = await createPostWithCategory(targetCateogryName)

    const posts = await app.service('posts').find({
      query: {
        $joinRelation: ['category'],
        'categories.name': targetCateogryName
      }
    })

    console.log(posts)
  })
})
