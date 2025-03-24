import { faker } from '@faker-js/faker'
import { insert } from '../../utils/factory.js'
import { categoriesTable } from './categories.shared.js'

export function generateCategory(attributes = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    ...attributes
  }
}

export function createCategory(attributes = {}) {
  return insert(generateCategory(attributes), categoriesTable)
}
