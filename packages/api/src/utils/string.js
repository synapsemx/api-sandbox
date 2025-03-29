export const splitIntoWords = (input = '') => {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
}

export const toKebabCase = (input = '') => splitIntoWords(input).join('-')

export const toSnakeCase = (input = '') => splitIntoWords(input).join('_')
