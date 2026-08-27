export const NON_BREAKING_SPACE = "\u00A0"

export function splitStringByLastDelimiter(str: string, delimiter: string): [string, string | undefined] {
  const lastIndex = str.lastIndexOf(delimiter)
  if (lastIndex === -1) {
    return [str, undefined]
  }

  return [str.substring(0, lastIndex), str.substring(lastIndex + delimiter.length)]
}

export function parseMultiValueInputString(input: string): string[] {
  return Array.from(new Set(
    input.split(/[\s,]+/).map(value => value.trim()).filter(Boolean),
  ))
}
