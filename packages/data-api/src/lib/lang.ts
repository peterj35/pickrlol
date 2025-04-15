const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const convertCamelObjectToSnake = (input: Record<string, unknown>) => {
  const out: Record<string, unknown> = {}

  Object.keys(input).forEach((k) => {
    const val = input[k]

    out[camelToSnakeCase(k)] = val
  })

  return out
}
