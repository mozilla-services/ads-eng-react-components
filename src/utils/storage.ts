export type StorageValidator<T> = (value: unknown) => value is T

export function isStorageObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function parseStorageValue<T>(rawValue: string | null, validate?: StorageValidator<T>): T | null {
  try {
    const parsed = JSON.parse(rawValue ?? "null")
    if (parsed === null) {
      return null
    }
    return !validate || validate(parsed) ? parsed as T : null
  }
  catch {
    return null
  }
}

/**
 * Read and JSON-parse a `localStorage` value.
 *
 * @param validate - Optional type guard. Values that fail it read as `null`, so a
 * malformed or stale entry degrades to the caller's default instead of throwing.
 */
export function getStorageItem<T>(key: string, validate?: StorageValidator<T>): T | null {
  return parseStorageValue(window.localStorage.getItem(key), validate)
}

export function setStorageItem<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string) {
  window.localStorage.removeItem(key)
}
