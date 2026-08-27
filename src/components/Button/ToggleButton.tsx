import {
  ToggleButton as MUIToggleButton, // eslint-disable-line no-restricted-imports
  ToggleButtonProps as MUIToggleButtonProps, // eslint-disable-line no-restricted-imports
  ToggleButtonGroup as MUIToggleButtonGroup, // eslint-disable-line no-restricted-imports
  ToggleButtonGroupProps as MUIToggleButtonGroupProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"

export type ToggleButtonProps = MUIToggleButtonProps

export const ToggleButton = (props: ToggleButtonProps) => {
  return (
    <MUIToggleButton {...props} />
  )
}

ToggleButton.displayName = "ToggleButton"

export type ToggleButtonGroupProps = MUIToggleButtonGroupProps

export const ToggleButtonGroup = (props: ToggleButtonGroupProps) => {
  return (
    <MUIToggleButtonGroup {...props} />
  )
}

ToggleButtonGroup.displayName = "ToggleButtonGroup"
