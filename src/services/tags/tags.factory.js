import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { tagsTable } from './tags.shared.js'

export function generateTag(attributes = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.word.noun(),
    ...attributes
  }
}

export function createTag(attributes = {}) {
  return insert(generateTag(attributes), tagsTable)
}
