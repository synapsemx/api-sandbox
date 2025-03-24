import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { commentsTable } from './comments.shared.js'

export function generateComment(attributes = {}) {
  return {
    id: faker.datatype.uuid(),
    morph_type: faker.helpers.arrayElement(['posts', 'pages']),
    morph_id: faker.datatype.uuid(),
    text: faker.lorem.sentence(),
    ...attributes
  }
}

export function createComment(attributes = {}) {
  return insert(generateComment(attributes), commentsTable)
}
