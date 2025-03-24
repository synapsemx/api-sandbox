import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { postsTable } from './posts.shared.js'

export function generatePost(attributes = {}) {
  return {
    id: faker.string.uuid(),
    category_id: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    ...attributes
  }
}

export function createPost(attributes = {}) {
  return insert(generatePost(attributes), postsTable)
}
