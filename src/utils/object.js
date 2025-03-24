/**
 * @param {Object<string, any>} entry
 * @param {Array<string>} keys
 * @returns {Object<string, any>}
 */
export const pick = (entry, keys) => {
  return keys.reduce((output, key) => ({ ...output, [key]: entry[key] }), {})
}
