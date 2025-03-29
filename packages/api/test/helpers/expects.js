export const times = async (callback, length) => {
  const result = []

  for (let i = 0; i < length; i++) {
    result.push(await callback(i))
  }

  return result
}
