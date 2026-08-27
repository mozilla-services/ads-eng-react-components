import React, { useState } from "react"
import { PageContext, PageState } from "../hooks/usePage"

export type PageProviderProps = React.PropsWithChildren

export const PageProvider = ({ children }: PageProviderProps) => {
  return (
    <PageContext.Provider value={useState<PageState>({})}>
      {children}
    </PageContext.Provider>
  )
}

PageProvider.displayName = "PageProvider"
