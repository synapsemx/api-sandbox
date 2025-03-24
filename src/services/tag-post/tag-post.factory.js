import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { tagPostsTable } from './tag-posts.shared.js'

export function generateTagPost(attributes = {}) {
  return {
    id: faker.datatype.uuid(),
    tag_id: faker.datatype.uuid(),
    post_id: faker.datatype.uuid(),
    ...attributes
  }
}

export function createTagPost(attributes = {}) {
  return insert(generateTagPost(attributes), tagPostsTable)
}
