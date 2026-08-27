import React from "react"
import { filterChildrenByBaseComponent } from "../../utils/components"
import { Breakpoint, Grid, GridSize, Typography } from "../Layout/Layout"
import { NON_BREAKING_SPACE } from "../../utils/strings"

export interface DescriptionListItemProps extends React.PropsWithChildren {
  title: string
}

export const DescriptionListItem: ExtendableComponent<DescriptionListItemProps> = ({
  children,
  title,
}: DescriptionListItemProps) => {
  return (
    <>
      <Typography component="dt" variant="h6">
        {title || NON_BREAKING_SPACE}
      </Typography>
      <Typography component="dd" variant="body2">
        {children || NON_BREAKING_SPACE}
      </Typography>
    </>
  )
}

DescriptionListItem.displayName = "DescriptionListItem"
DescriptionListItem.baseType = Symbol.for(DescriptionListItem.displayName)

type ResponsiveStyleValue<T> = Partial<Record<Breakpoint, T | null>>

export interface DescriptionListProps {
  children?: React.ReactNode
  size?: ResponsiveStyleValue<GridSize>
}

export const DescriptionList = ({
  children,
  size,
}: DescriptionListProps) => {
  const items = filterChildrenByBaseComponent(DescriptionListItem, children)

  return (
    <Grid component="dl" size={{ xs: 12, md: 6, ...size }} sx={{ mt: 0 }}>
      {items}
    </Grid>
  )
}

DescriptionList.displayName = "DescriptionList"
