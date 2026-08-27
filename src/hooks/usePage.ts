import React from "react"

export interface PageState {
  showSearch?: boolean
  title?: string
}

export const PageContext = React.createContext<[PageState, React.Dispatch<React.SetStateAction<PageState>>]>([
  {},

  () => {},
])

export const usePage = () => React.useContext(PageContext)
