/**
 * @param {Object<string, any>} entry
 * @param {Array<string>} keys
 * @returns {Object<string, any>}
 */
export const pick = (entry, keys) => {
  return keys.reduce((output, key) => {
    if (entry[key] !== undefined) {
      output[key] = entry[key]
    }

    return output
  }, {})
}
