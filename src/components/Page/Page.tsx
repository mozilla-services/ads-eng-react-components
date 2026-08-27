import { useLayoutEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import { PageState, usePage } from "../../hooks/usePage"
import { CircularProgress } from "../Progress/Progress"
import { Box } from "../Layout/Layout"

export type PageProps = Omit<PageState, "baseTitle"> & React.PropsWithChildren

export const Page: ExtendableComponent<PageProps> = ({
  showSearch,
  title,
  children,
}: PageProps) => {
  const [page, setPage] = usePage()

  useLayoutEffect(() => {
    setPage({
      ...page,
      showSearch,
      title,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch, title])

  const documentTitle = [page.baseTitle, title].filter(Boolean).join(": ")

  return (
    <>
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      {children}
    </>
  )
}

Page.displayName = "Page"
Page.baseType = Symbol.for(Page.displayName)

export interface EmbeddedPageProps extends Omit<PageProps, "children"> {
  href?: string
}

export const EmbeddedPage: ExtendableComponent<EmbeddedPageProps> = (props: EmbeddedPageProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const ref = useRef<HTMLIFrameElement>(null)

  const filteredProps: Partial<EmbeddedPageProps> = { ...props }
  delete filteredProps.href

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <Page {...filteredProps}>
      <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <iframe
          ref={ref}
          src={props.href}
          title={props.title}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            visibility: loading || error ? "hidden" : "visible",
          }}
          aria-label={`Embedded Page: ${props.title}`}
        />
        {loading && (
          <CircularProgress
            size="1.5rem"
            sx={{
              position: "absolute",
              top: "calc(50% - 0.75rem)",
              left: "calc(50% - 0.75rem)",
            }}
          />
        )}
      </Box>
    </Page>
  )
}

EmbeddedPage.displayName = "EmbeddedPage"
EmbeddedPage.baseType = Page.baseType
