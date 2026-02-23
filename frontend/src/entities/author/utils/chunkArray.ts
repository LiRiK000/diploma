export const chunkArray = <T>(array: T[], size: number): T[][] => {
  if (!array) return []
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, size + i))
  }
  return result
}
