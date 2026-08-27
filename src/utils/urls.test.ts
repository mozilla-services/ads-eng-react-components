import * as axiosImport from "axios"

import {
  downloadBlob,
  downloadUrl,
  getCurrentBase,
  getCurrentOrigin,
  getCurrentPathname,
  getCurrentPathnameWithHash,
  getFormattedSearchParamsString,
  getHistoryStateHashParam,
  getHistoryStateHashParams,
  getHistoryStateParams,
  getHistoryStateQueryParam,
  getHistoryStateQueryParams,
  getNavigateToHrefClickHandler,
  getObjectFromSearchParams,
  getParamsFromUrl,
  getSearchParamsFromObject,
  getUrlForEmailAddress,
  getUrlFromBaseWithParams,
  mergeSearchParams,
  navigateToHref,
  removeSearchParams,
  setHistoryStateHashParam,
  setHistoryStateQueryParam,
} from "./urls"

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
}))

const TEST_ORIGIN = "http://localhost"

function setLocation(url: string) {
  window.history.replaceState(null, "", url)
}

describe("urls.ts", () => {
  beforeEach(() => {
    setLocation("/")
  })

  describe("current location helpers", () => {
    test("getCurrentOrigin() returns window.location.origin", () => {
      expect(getCurrentOrigin()).toBe(TEST_ORIGIN)
    })

    test("getCurrentPathname() returns the pathname", () => {
      setLocation("/foo/bar")
      expect(getCurrentPathname()).toBe("/foo/bar")
    })

    test("getCurrentPathnameWithHash() appends the hash", () => {
      setLocation("/foo#tab=one")
      expect(getCurrentPathnameWithHash()).toBe("/foo#tab=one")
    })

    test("getCurrentPathnameWithHash() omits an absent hash", () => {
      setLocation("/foo")
      expect(getCurrentPathnameWithHash()).toBe("/foo")
    })

    test("getCurrentBase() joins origin and pathname", () => {
      setLocation("/foo/bar")
      expect(getCurrentBase()).toBe(`${TEST_ORIGIN}/foo/bar`)
    })
  })

  describe("getFormattedSearchParamsString()", () => {
    test("returns an empty string when no params are given", () => {
      expect(getFormattedSearchParamsString()).toBe("")
    })

    test("unescapes commas, at-signs and square brackets", () => {
      const params = new URLSearchParams()
      params.set("a", "1,2")
      params.set("b", "x@y")
      params.set("c[]", "3")
      expect(getFormattedSearchParamsString(params)).toBe("a=1,2&b=x@y&c[]=3")
    })
  })

  describe("getUrlFromBaseWithParams()", () => {
    test("leaves a base without params unchanged", () => {
      expect(getUrlFromBaseWithParams("/foo").toString()).toBe(`${TEST_ORIGIN}/foo`)
    })

    test("resolves a relative base against the current origin", () => {
      const url = getUrlFromBaseWithParams("/foo", { queryParams: new URLSearchParams("a=1") })
      expect(url.toString()).toBe(`${TEST_ORIGIN}/foo?a=1`)
    })

    test("keeps an absolute base as-is", () => {
      const url = getUrlFromBaseWithParams("https://example.com/foo")
      expect(url.toString()).toBe("https://example.com/foo")
    })

    test("appends both query and hash params", () => {
      const url = getUrlFromBaseWithParams("/foo", {
        queryParams: new URLSearchParams("a=1"),
        hashParams: new URLSearchParams("b=2"),
      })
      expect(url.toString()).toBe(`${TEST_ORIGIN}/foo?a=1#b=2`)
    })
  })

  describe("getParamsFromUrl()", () => {
    test("returns sorted query and hash params", () => {
      const { queryParams, hashParams } = getParamsFromUrl(new URL(`${TEST_ORIGIN}/foo?b=2&a=1#d=4&c=3`))
      expect(queryParams?.toString()).toBe("a=1&b=2")
      expect(hashParams?.toString()).toBe("c=3&d=4")
    })

    test("returns undefined for absent params", () => {
      const { queryParams, hashParams } = getParamsFromUrl(new URL(`${TEST_ORIGIN}/foo`))
      expect(queryParams).toBeUndefined()
      expect(hashParams).toBeUndefined()
    })
  })

  describe("getSearchParamsFromObject()", () => {
    test("appends one entry per array item", () => {
      expect(getSearchParamsFromObject({ a: [1, 2] }).toString()).toBe("a=1&a=2")
    })

    test("skips undefined, null and empty-string values", () => {
      expect(getSearchParamsFromObject({ a: 1, b: undefined, c: null, d: "" }).toString()).toBe("a=1")
    })
  })

  describe("getObjectFromSearchParams()", () => {
    test("maps single values directly", () => {
      expect(getObjectFromSearchParams(new URLSearchParams("a=1&b=2"))).toEqual({ a: "1", b: "2" })
    })

    test("collects repeated keys into an array", () => {
      expect(getObjectFromSearchParams(new URLSearchParams("a=1&a=2&a=3"))).toEqual({ a: ["1", "2", "3"] })
    })
  })

  describe("mergeSearchParams()", () => {
    test("merges URLSearchParams and plain objects", () => {
      const merged = mergeSearchParams(new URLSearchParams("a=1"), { b: 2 }, undefined)
      expect(merged.toString()).toBe("a=1&b=2")
    })

    test("later sources win on key collisions", () => {
      expect(mergeSearchParams(new URLSearchParams("a=1"), { a: 2 }).get("a")).toBe("2")
    })
  })

  describe("removeSearchParams()", () => {
    test("removes the named keys without mutating the input", () => {
      const original = new URLSearchParams("a=1&b=2&c=3")
      expect(removeSearchParams(original, "a", "c").toString()).toBe("b=2")
      expect(original.toString()).toBe("a=1&b=2&c=3")
    })
  })

  describe("history state", () => {
    test("getHistoryStateParams() reads the current URL", () => {
      setLocation("/foo?a=1#b=2")
      const { queryParams, hashParams } = getHistoryStateParams()
      expect(queryParams?.get("a")).toBe("1")
      expect(hashParams?.get("b")).toBe("2")
    })

    test("getHistoryStateQueryParams() defaults to empty", () => {
      expect(getHistoryStateQueryParams().toString()).toBe("")
    })

    test("getHistoryStateHashParams() defaults to empty", () => {
      expect(getHistoryStateHashParams().toString()).toBe("")
    })

    test("setHistoryStateQueryParam() adds a param", () => {
      setHistoryStateQueryParam("a", "1")
      expect(getHistoryStateQueryParam("a")).toBe("1")
    })

    test("setHistoryStateQueryParam() updates an existing param", () => {
      setLocation("/foo?a=1")
      setHistoryStateQueryParam("a", "2")
      expect(getHistoryStateQueryParam("a")).toBe("2")
    })

    test("setHistoryStateQueryParam() removes the param when no value is given", () => {
      setLocation("/foo?a=1&b=2")
      setHistoryStateQueryParam("a")
      expect(getHistoryStateQueryParam("a")).toBeUndefined()
      expect(getHistoryStateQueryParam("b")).toBe("2")
    })

    test("setHistoryStateHashParam() round-trips a hash param", () => {
      setHistoryStateHashParam("tab", "one")
      expect(getHistoryStateHashParam("tab")).toBe("one")
    })

    test("setHistoryStateHashParam() removes the param when no value is given", () => {
      setLocation("/foo#tab=one")
      setHistoryStateHashParam("tab")
      expect(getHistoryStateHashParam("tab")).toBeUndefined()
    })

    test("getHistoryStateQueryParam() returns undefined for an absent key", () => {
      expect(getHistoryStateQueryParam("nope")).toBeUndefined()
    })
  })

  describe("navigateToHref()", () => {
    test("does nothing without an href", () => {
      const navigate = jest.fn()
      navigateToHref(navigate)
      expect(navigate).not.toHaveBeenCalled()
    })

    test("routes a path through `navigate` and suppresses the default action", () => {
      const navigate = jest.fn()
      const event = { preventDefault: jest.fn() } as unknown as React.MouseEvent
      navigateToHref(navigate, "/foo", event)
      expect(navigate).toHaveBeenCalledWith("/foo")
      expect(event.preventDefault).toHaveBeenCalled()
    })

    test("routes a hash that differs from the current one", () => {
      setLocation("/foo#a=1")
      const navigate = jest.fn()
      navigateToHref(navigate, "#b=2")
      expect(navigate).toHaveBeenCalledWith("#b=2")
    })

    test("skips navigation when the hash already matches", () => {
      setLocation("/foo#a=1")
      const navigate = jest.fn()
      navigateToHref(navigate, "#a=1")
      expect(navigate).not.toHaveBeenCalled()
    })

    test("leaves the SPA for an absolute href", () => {
      // `window.location` is non-configurable in jsdom, so the `location.href = …`
      // assignment can't be observed directly. Assert the two things that make the
      // browser — rather than the router — follow the link: `navigate` is bypassed and
      // the default action is left intact.
      const navigate = jest.fn()
      const event = { preventDefault: jest.fn() } as unknown as React.MouseEvent

      navigateToHref(navigate, "https://example.com/foo", event)

      expect(navigate).not.toHaveBeenCalled()
      expect(event.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe("getNavigateToHrefClickHandler()", () => {
    test("invokes `onClick` then navigates", () => {
      const calls: string[] = []
      const navigate = jest.fn(() => calls.push("navigate"))
      const onClick = jest.fn(() => calls.push("onClick"))
      const event = { preventDefault: jest.fn() } as unknown as React.MouseEvent

      getNavigateToHrefClickHandler(navigate, "/foo", onClick)(event)

      expect(calls).toEqual(["onClick", "navigate"])
    })

    test("invokes `onClick` even without an href", () => {
      const navigate = jest.fn()
      const onClick = jest.fn()
      getNavigateToHrefClickHandler(navigate, undefined, onClick)({} as React.MouseEvent)
      expect(onClick).toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe("getUrlForEmailAddress()", () => {
    test("prefixes a bare address with mailto:", () => {
      expect(getUrlForEmailAddress("ada@example.com")).toBe("mailto:ada@example.com")
    })

    test("extracts the address from RFC 5322 name-plus-address form", () => {
      expect(getUrlForEmailAddress("Ada Lovelace <ada@example.com>")).toBe("mailto:ada@example.com")
    })

    test("handles an empty string", () => {
      expect(getUrlForEmailAddress("")).toBe("mailto:")
    })
  })

  describe("downloadBlob()", () => {
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
    })

    test("creates a blob URL, triggers the download, then cleans up", () => {
      const mockUrl = "blob:http://localhost/mock-blob-url"
      URL.createObjectURL = jest.fn().mockReturnValue(mockUrl)
      URL.revokeObjectURL = jest.fn()
      const mockLink = { href: "", download: "", click: jest.fn() }
      const createElementSpy = jest.spyOn(document, "createElement").mockReturnValue(mockLink as unknown as HTMLAnchorElement)
      const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation()
      const removeChildSpy = jest.spyOn(document.body, "removeChild").mockImplementation()

      const blob = new Blob(["test content"], { type: "text/csv" })
      downloadBlob("test-file.csv", blob)

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
      expect(mockLink.href).toBe(mockUrl)
      expect(mockLink.download).toBe("test-file.csv")
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink)
      expect(mockLink.click).toHaveBeenCalled()

      // The anchor and object URL survive the click and are torn down on the next tick.
      expect(removeChildSpy).not.toHaveBeenCalled()
      expect(URL.revokeObjectURL).not.toHaveBeenCalled()

      jest.runAllTimers()

      expect(removeChildSpy).toHaveBeenCalledWith(mockLink)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl)

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })

  describe("downloadUrl()", () => {
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
    })

    test("fetches the URL as a blob and saves it under the given filename", async () => {
      const blob = new Blob(["a,b\n1,2"], { type: "text/csv" })
      const mockUrl = "blob:http://localhost/mock-blob-url"
      URL.createObjectURL = jest.fn().mockReturnValue(mockUrl)
      URL.revokeObjectURL = jest.fn()

      const mockAxiosGet = jest.spyOn(axiosImport.default, "get").mockResolvedValue({ data: blob })
      const mockLink = { href: "", download: "", click: jest.fn() }
      const createElementSpy = jest.spyOn(document, "createElement").mockReturnValue(mockLink as unknown as HTMLAnchorElement)
      const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation()
      jest.spyOn(document.body, "removeChild").mockImplementation()

      await downloadUrl("report.csv", "/api/report/")

      expect(mockAxiosGet).toHaveBeenCalledWith("/api/report/", { responseType: "blob" })
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
      expect(mockLink.download).toBe("report.csv")
      expect(mockLink.click).toHaveBeenCalled()

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
    })

    test("propagates a fetch failure instead of downloading", async () => {
      const mockAxiosGet = jest.spyOn(axiosImport.default, "get").mockRejectedValue(new Error("nope"))
      URL.createObjectURL = jest.fn()

      await expect(downloadUrl("report.csv", "/api/report/")).rejects.toThrow("nope")

      expect(mockAxiosGet).toHaveBeenCalled()
      expect(URL.createObjectURL).not.toHaveBeenCalled()
    })
  })
})
