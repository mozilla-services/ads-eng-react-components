import {
  Badge as MUIBadge, // eslint-disable-line no-restricted-imports
  BadgeProps as MUIBadgeProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledBadge = styled(MUIBadge)`
  .MuiSvgIcon-root:nth-of-type(1) {
    font-size: 20px;
  }
`

export type BadgeProps = MUIBadgeProps

export const Badge = (props: MUIBadgeProps) => {
  return (
    <StyledBadge color="primary" {...props} />
  )
}

Badge.displayName = "Badge"
