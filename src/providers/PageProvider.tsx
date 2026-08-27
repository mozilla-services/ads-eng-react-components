import React, { useState } from "react"
import { PageContext, PageState } from "../hooks/usePage"

export interface PageProviderProps extends React.PropsWithChildren {
  baseTitle?: string
}

export const PageProvider = ({
  children,
  baseTitle,
}: PageProviderProps) => {
  return (
    <PageContext.Provider value={useState<PageState>({ baseTitle })}>
      {children}
    </PageContext.Provider>
  )
}

PageProvider.displayName = "PageProvider"
