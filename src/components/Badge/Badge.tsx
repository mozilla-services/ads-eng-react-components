import {
  Badge as MUIBadge, // eslint-disable-line no-restricted-imports
  BadgeProps as MUIBadgeProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"

export type BadgeProps = MUIBadgeProps

export const Badge = (props: MUIBadgeProps) => {
  return (
    <MUIBadge color="primary" {...props} />
  )
}

Badge.displayName = "Badge"
