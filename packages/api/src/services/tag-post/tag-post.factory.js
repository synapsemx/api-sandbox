import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { tagPostTable } from './tag-post.shared.js'

export function generateTagPost(attributes = {}) {
  return {
    id: faker.string.uuid(),
    tag_id: faker.string.uuid(),
    post_id: faker.string.uuid(),
    ...attributes
  }
}

export function createTagPost(attributes = {}) {
  return insert(generateTagPost(attributes), tagPostTable)
}
