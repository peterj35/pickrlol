export const objToArr = <T>(obj: Record<string, T | undefined>) => {
  return Object.keys(obj).map((k) => obj[k] as T)
}
