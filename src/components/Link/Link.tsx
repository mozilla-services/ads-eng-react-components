import {
  Link as MUILink, // eslint-disable-line no-restricted-imports
  LinkProps as MUILinkProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"
import React from "react"
import { Link as ReactRouterLink, To, useLocation, useNavigate } from "react-router-dom"

export interface BackLinkProps extends React.PropsWithChildren {
  to: To
}

export const BackLink = ({
  children,
  to,
}: BackLinkProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const hasHistory = location.key !== "default"
  if (hasHistory) {
    const onClick = (event: React.MouseEvent) => {
      navigate(-1)
      event.preventDefault()
    }

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href="" onClick={onClick}>{children}</a>
    )
  }

  return (
    <ReactRouterLink to={to}>{children}</ReactRouterLink>
  )
}

BackLink.displayName = "BackLink"

export type ExternalLinkProps = MUILinkProps

export const ExternalLink: ExtendableComponent<ExternalLinkProps> = styled(MUILink)`
  ::after {
    content: "\\A";
    white-space: pre;
  }
`

ExternalLink.displayName = "ExternalLink"
ExternalLink.baseType = Symbol.for(ExternalLink.displayName)

export interface ExternalLinkOrNoneProps extends React.PropsWithChildren {
  href: string | null
}

export const ExternalLinkOrNone: ExtendableComponent<ExternalLinkOrNoneProps> = ({
  children,
  href,
}: ExternalLinkOrNoneProps) => {
  const childrenCount = React.Children.count(children)
  const content = childrenCount > 0 ? children : "(none)"
  if (!href || childrenCount === 0) {
    return (
      <>{content}</>
    )
  }

  return (
    <>
      <ExternalLink href={href} rel="noreferrer" target="_blank">{content}</ExternalLink>
    </>
  )
}

ExternalLinkOrNone.displayName = "ExternalLinkOrNone"
ExternalLinkOrNone.baseType = ExternalLink.baseType
