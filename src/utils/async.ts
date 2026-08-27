/**
 * Sleep for a specified number of milliseconds
 * @param ms - Number of milliseconds to sleep (defaults to 0)
 * @returns Promise that resolves after the specified delay
 */
export function sleep(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
