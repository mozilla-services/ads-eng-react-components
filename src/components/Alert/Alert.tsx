import {
  Alert as MUIAlert, // eslint-disable-line no-restricted-imports
  AlertProps as MUIAlertProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"

export type AlertProps = MUIAlertProps

export const Alert = (props: AlertProps) => {
  return (
    <MUIAlert
      slotProps={{
        action: {
          sx: {
            pt: "1px",
          },
        },
      }}
      {...props}
    />
  )
}

Alert.displayName = "Alert"
