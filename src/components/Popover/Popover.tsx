import {
  Popover as MUIPopover, // eslint-disable-line no-restricted-imports
  PopoverProps as MUIPopoverProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { Property } from "csstype"
import React, { forwardRef, useId, useImperativeHandle, useState } from "react"
import { Stack } from "../Layout/Layout"

export interface PopoverHandle {
  close: () => void
  open: () => void
}

export interface PopoverProps extends React.PropsWithChildren, Pick<MUIPopoverProps, "anchorOrigin" | "transformOrigin"> {
  anchorRef: React.RefObject<HTMLElement>
  backgroundColor?: Property.BackgroundColor
  className?: string
  minWidth?: Property.MinWidth
  padding?: Property.Padding
  onClose?: () => void
  onOpen?: () => void
}

export const Popover = forwardRef<PopoverHandle, PopoverProps>(({
  children,
  anchorRef,
  backgroundColor,
  className,
  minWidth,
  padding = "8px",
  anchorOrigin = { horizontal: "center", vertical: "bottom" },
  transformOrigin = { horizontal: "center", vertical: "top" },
  onClose,
  onOpen,
}: PopoverProps, ref: React.ForwardedRef<PopoverHandle>) => {
  const key = useId()

  const [open, setOpen] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }))

  const handleOpen = () => {
    setOpen(true)
    onOpen?.()
  }

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  return (
    <MUIPopover
      key={key}
      anchorEl={anchorRef.current}
      anchorOrigin={anchorOrigin}
      className={className}
      open={open}
      transformOrigin={transformOrigin}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor,
            minWidth,
            padding,
          },
        },
      }}
    >
      <Stack direction="column" spacing={1}>
        {children}
      </Stack>
    </MUIPopover>
  )
})

Popover.displayName = "Popover"
