import {
  Tooltip as MUITooltip, // eslint-disable-line no-restricted-imports
  TooltipProps as MUITooltipProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"

export type TooltipProps = MUITooltipProps

export const Tooltip = (props: TooltipProps) => {
  return (
    <MUITooltip {...props} />
  )
}

Tooltip.displayName = "Tooltip"
