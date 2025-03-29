import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { relatedPostTable } from './related-post.shared.js'

export function generateRelatedPost(attributes = {}) {
  return {
    id: faker.string.uuid(),
    post_id: faker.string.uuid(),
    related_post_id: faker.string.uuid(),
    ...attributes
  }
}

export function createRelatedPost(attributes = {}) {
  return insert(generateRelatedPost(attributes), relatedPostTable)
}
