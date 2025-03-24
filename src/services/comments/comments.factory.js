import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { commentsTable } from './comments.shared.js'

export function generateComment(attributes = {}) {
  return {
    id: faker.string.uuid(),
    morph_type: faker.helpers.arrayElement(['posts', 'pages']),
    morph_id: faker.string.uuid(),
    text: faker.lorem.sentence(),
    ...attributes
  }
}

export function createComment(attributes = {}) {
  return insert(generateComment(attributes), commentsTable)
}
