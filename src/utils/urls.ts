import axios from "axios"
import { NavigateFunction } from "react-router-dom"

export interface URLParams {
  queryParams?: URLSearchParams
  hashParams?: URLSearchParams
}

export type URLBase = `${URLOrigin}${URLPathname}`
export type URLOrigin = `${URLProtocol}://${string}`
export type URLPathname = `/${string}`
export type URLProtocol = "http" | "https"

export function getCurrentBase(): URLBase {
  return `${getCurrentOrigin()}${getCurrentPathname()}`
}

export function getCurrentOrigin(): URLOrigin {
  return window.location.origin as URLOrigin
}

export function getCurrentPathname(): URLPathname {
  const pathname = window.location.pathname
  if (!pathname.startsWith("/")) {
    return `/${pathname}`
  }

  return pathname as URLPathname
}

export function getCurrentPathnameWithHash(): URLPathname {
  return `${getCurrentPathname()}${window.location.hash}`
}

export function getFormattedSearchParamsString(searchParams?: URLSearchParams): string {
  return searchParams?.toString()
    .replace(/%2C/g, ",")
    .replace(/%40/g, "@")
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]") ?? ""
}

export function getUrlFromBaseWithParams(base: string, params?: URLParams): URL {
  const queryParamsString = getFormattedSearchParamsString(params?.queryParams)
  const hashParamsString = getFormattedSearchParamsString(params?.hashParams)

  return new URL([
    base.startsWith("http://") || base.startsWith("https://") ? base : `${window.location.origin}${base}`,
    queryParamsString ? `?${queryParamsString}` : "",
    hashParamsString ? `#${hashParamsString}` : "",
  ].join(""))
}

export function getParamsFromUrl(url: URL): URLParams {
  const queryParams = url.searchParams.size > 0 ? url.searchParams : undefined
  queryParams?.sort()
  const hashParams = url.hash ? new URLSearchParams(url.hash.substring(1)) : undefined
  hashParams?.sort()
  return { queryParams, hashParams }
}

export function getSearchParamsFromObject(object: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams()
  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((value) => {
        searchParams.append(key, value)
      })
    }
    else if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value as string)
    }
  })
  searchParams.sort()
  return searchParams
}

export function getObjectFromSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
  const object: Record<string, unknown> = {}
  for (const [key, value] of searchParams) {
    const existingValue = object[key]
    if (existingValue) {
      if (Array.isArray(existingValue)) {
        existingValue.push(value)
      }
      else {
        object[key] = [existingValue, value]
      }
    }
    else {
      object[key] = value
    }
  }
  return object
}

export function mergeSearchParams(...searchParams: (URLSearchParams | Record<string, unknown> | undefined)[]): URLSearchParams {
  const mergedSearchParams = new URLSearchParams(Object.fromEntries(searchParams.flatMap((searchParams) => {
    if (!searchParams) {
      return []
    }

    return [...(searchParams instanceof URLSearchParams ? searchParams : getSearchParamsFromObject(searchParams))]
  })))
  mergedSearchParams.sort()
  return mergedSearchParams
}

export function removeSearchParams(searchParams: URLSearchParams, ...keys: string[]): URLSearchParams {
  const updatedSearchParams = new URLSearchParams(searchParams)
  for (const key of keys) {
    updatedSearchParams.delete(key)
  }
  return updatedSearchParams
}

export function replaceHistoryState(params: URLParams) {
  const url = getUrlFromBaseWithParams(getCurrentBase(), params)
  history.replaceState(null, "", url)
}

export function getHistoryStateParams(): URLParams {
  try {
    return getParamsFromUrl(new URL(window.location.href))
  }
  catch {
    return {}
  }
}

export function getHistoryStateQueryParams(): URLSearchParams {
  return getHistoryStateParams().queryParams ?? new URLSearchParams()
}

export function getHistoryStateHashParams(): URLSearchParams {
  return getHistoryStateParams().hashParams ?? new URLSearchParams()
}

export function replaceHistoryStateQueryParams(queryParams?: URLSearchParams) {
  replaceHistoryState({ ...getHistoryStateParams(), queryParams })
}

export function replaceHistoryStateHashParams(hashParams?: URLSearchParams) {
  replaceHistoryState({ ...getHistoryStateParams(), hashParams })
}

export function getHistoryStateQueryParam(key: string): string | undefined {
  return getHistoryStateParams().queryParams?.get(key) ?? undefined
}

export function setHistoryStateQueryParam(key: string, value?: string) {
  const queryParams = getHistoryStateParams().queryParams ?? new URLSearchParams()
  if (value) {
    queryParams.set(key, value)
    queryParams.sort()
  }
  else {
    queryParams.delete(key)
  }
  replaceHistoryStateQueryParams(queryParams.size > 0 ? queryParams : undefined)
}

export function getHistoryStateHashParam(key: string): string | undefined {
  return getHistoryStateParams().hashParams?.get(key) ?? undefined
}

export function setHistoryStateHashParam(key: string, value?: string) {
  const hashParams = getHistoryStateParams().hashParams ?? new URLSearchParams()
  if (value) {
    hashParams.set(key, value)
    hashParams.sort()
  }
  else {
    hashParams.delete(key)
  }
  replaceHistoryStateHashParams(hashParams.size > 0 ? hashParams : undefined)
}

/**
 * Build a `mailto:` URL from a display string, tolerating RFC 5322 name-plus-address form (e.g.
 * `"Ada Lovelace <ada@example.com>"` returns `"mailto:ada@example.com"`).
 */
export function getUrlForEmailAddress(emailAddress: string): string {
  const leftCaretIndex = emailAddress.indexOf("<")
  return `mailto:${leftCaretIndex === -1 ? emailAddress : emailAddress.substring(leftCaretIndex + 1, emailAddress.length - 1)}`
}

/**
 * Save a `Blob` to the user's downloads via a synthetic anchor click.
 *
 * The object URL and the anchor are cleaned up on a `setTimeout` so the click has a chance
 * to be handled first.
 */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}

/**
 * Fetch a URL as a `Blob` and save it under `filename`.
 *
 * Uses the shared `axios` instance so the consuming app's interceptors and headers apply.
 */
export async function downloadUrl(filename: string, url: string) {
  const { data } = await axios.get<Blob>(url, { responseType: "blob" })
  downloadBlob(filename, data)
}

export function navigateToHref(navigate: NavigateFunction, href?: string, event?: React.MouseEvent) {
  if (href) {
    if (!href.startsWith("/") && !href.startsWith("#")) {
      window.location.href = href
      return
    }

    if (href.startsWith("#")) {
      if (href !== (window.location.hash || "#")) {
        navigate(href)
      }
    }
    else {
      navigate(href)
    }

    event?.preventDefault()
  }
}

export function getNavigateToHrefClickHandler(navigate: NavigateFunction, href?: string, onClick?: React.MouseEventHandler): React.MouseEventHandler {
  return (event: React.MouseEvent) => {
    onClick?.(event)
    navigateToHref(navigate, href, event)
  }
}
