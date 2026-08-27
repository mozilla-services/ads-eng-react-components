import { sleep } from "./async"

describe("async.ts", () => {
  test("sleep() resolves after the given delay", async () => {
    const start = performance.now()
    await sleep(20)
    expect(performance.now() - start).toBeGreaterThanOrEqual(15)
  })

  test("sleep() defaults to no delay", async () => {
    await expect(sleep()).resolves.toBeUndefined()
  })
})
