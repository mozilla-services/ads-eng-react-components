class MockStorage implements Storage {
  private _store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this._store).length
  }

  clear(): void {
    this._store = {}
  }

  getItem(key: string): string | null {
    return this._store[key] ?? null
  }

  key(index: number): string | null {
    return Object.keys(this._store)[index] ?? null
  }

  setItem(key: string, value: string): void {
    this._store[key] = value
  }

  removeItem(key: string): void {
    delete this._store[key]
  }
}

function createMockStorage(): MockStorage {
  const storage = new MockStorage()
  const store = () => storage["_store" as keyof MockStorage] as unknown as Record<string, string>

  return new Proxy(storage, {
    get(target, prop, receiver) {
      const items = store()
      if (typeof prop === "string" && prop in items) {
        return items[prop]
      }
      return Reflect.get(target, prop, receiver)
    },
    has(target, prop) {
      return (typeof prop === "string" && prop in store()) || Reflect.has(target, prop)
    },
    ownKeys() {
      return Object.keys(store())
    },
    getOwnPropertyDescriptor(target, prop) {
      const items = store()
      if (typeof prop === "string" && prop in items) {
        return { value: items[prop], enumerable: true, configurable: true, writable: true }
      }
      return Reflect.getOwnPropertyDescriptor(target, prop)
    },
  })
}

export const mockLocalStorage: MockStorage = createMockStorage()
export const mockSessionStorage: MockStorage = createMockStorage()
