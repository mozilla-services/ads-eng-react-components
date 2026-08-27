import {
  Chip as MUIChip, // eslint-disable-line no-restricted-imports
  ChipProps as MUIChipProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { SvgIconComponent } from "@mui/icons-material"
import { Tooltip } from "../Tooltip/Tooltip"

export type ChipProps = MUIChipProps

export const Chip: ExtendableComponent<ChipProps> = (props: ChipProps) => {
  return (
    <MUIChip {...props} />
  )
}

Chip.displayName = "Chip"
Chip.baseType = Symbol.for(Chip.displayName)

export interface ActionChipProps extends Omit<ChipProps, "deleteIcon" | "onDelete"> {
  actionIcon?: SvgIconComponent
  tooltipTitle?: string
  onAction?: (event: React.SyntheticEvent | React.MouseEvent) => void
  onTooltipClose?: (event: React.SyntheticEvent | Event) => void
}

export const ActionChip: ExtendableComponent<ActionChipProps> = (props: ActionChipProps) => {
  const filteredProps: Partial<ActionChipProps> = { ...props }
  delete (filteredProps as ChipProps).deleteIcon
  delete (filteredProps as ChipProps).onDelete
  delete filteredProps.actionIcon
  delete filteredProps.tooltipTitle
  delete filteredProps.onAction
  delete filteredProps.onTooltipClose
  delete filteredProps.sx

  const handleDelete = (event: React.SyntheticEvent | React.MouseEvent) => {
    if (props.onAction) {
      props.onAction(event)
    }

    else {
      props.onClick?.(event as React.MouseEvent<HTMLDivElement>)
    }
  }

  const ActionIcon = props.actionIcon

  const chip = (
    <Chip
      deleteIcon={ActionIcon ? (<ActionIcon />) : undefined}
      size="small"
      sx={{ fontSize: 10, ml: 0.55, pt: 0.1, ...props.sx }}
      onDelete={props.onAction || props.onClick ? handleDelete : undefined}
      {...filteredProps}
    />
  )

  if (!props.tooltipTitle) {
    return chip
  }

  return (
    <Tooltip title={props.tooltipTitle} onClose={props.onTooltipClose}>
      {chip}
    </Tooltip>
  )
}

ActionChip.displayName = "ActionChip"
ActionChip.baseType = Chip.baseType
