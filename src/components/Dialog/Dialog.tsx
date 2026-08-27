import {
  Dialog as MUIDialog, // eslint-disable-line no-restricted-imports
  DialogActions as MUIDialogActions, // eslint-disable-line no-restricted-imports
  DialogContent as MUIDialogContent, // eslint-disable-line no-restricted-imports
  DialogTitle as MUIDialogTitle, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import React, { forwardRef, useId, useImperativeHandle, useRef, useState } from "react"
import { createRoot, Root } from "react-dom/client"
import { Button } from "../Button/Button"
import { CircularProgress } from "../Progress/Progress"
import { Stack } from "../Layout/Layout"

export type DialogAction = "close" | "primary"

export interface DialogHandle {
  close: () => void
  open: () => void
}

export interface DialogProps extends React.PropsWithChildren {
  title?: React.ReactNode
  closeButtonTitle?: React.ReactNode
  primaryButtonTitle?: React.ReactNode
  closeOnError?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  keepMounted?: boolean
  suppressCloseButton?: boolean
  suppressPrimaryButton?: boolean

  onAction?: (dialogAction: DialogAction) => Promise<void>
  onClose?: () => void
  onOpen?: () => void
}

export const Dialog = forwardRef<DialogHandle, DialogProps>(({
  children,
  title,
  closeButtonTitle = "Cancel",
  primaryButtonTitle = "Confirm",
  closeOnError = false,
  fullWidth,
  fullHeight,
  keepMounted,
  suppressCloseButton = false,
  suppressPrimaryButton = false,

  onAction,
  onClose,
  onOpen,
}: DialogProps, ref: React.ForwardedRef<DialogHandle>) => {
  const key = useId()

  const [open, setOpen] = useState<boolean>(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null)

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleCloseAction,
  }))

  const setActionButtonsDisabled = (disabled: boolean) => {
    if (closeButtonRef.current) {
      closeButtonRef.current.disabled = disabled
    }
    if (primaryButtonRef.current) {
      primaryButtonRef.current.disabled = disabled
    }
  }

  let closeButtonRoot: Root | undefined

  const setCloseActionIsPending = (isPending: boolean) => {
    if (closeButtonRef.current) {
      setActionButtonsDisabled(isPending)

      if (!closeButtonRoot) {
        closeButtonRoot = createRoot(closeButtonRef.current)
      }

      closeButtonRoot.render(isPending ? (<CircularProgress size="1.5rem" />) : closeButtonTitle)
    }
  }

  let primaryButtonRoot: Root | undefined

  const setPrimaryActionIsPending = (isPending: boolean) => {
    if (primaryButtonRef.current) {
      setActionButtonsDisabled(isPending)

      if (!primaryButtonRoot) {
        primaryButtonRoot = createRoot(primaryButtonRef.current)
      }

      primaryButtonRoot.render(isPending ? (<CircularProgress size="1.5rem" />) : primaryButtonTitle)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    onOpen?.()
  }

  const handleCloseAction = async () => {
    setCloseActionIsPending(true)

    try {
      await onAction?.("close")

      setOpen(false)
      onClose?.()
    }
    catch {
      if (closeOnError) {
        setOpen(false)
        onClose?.()
      }
    }
    finally {
      setCloseActionIsPending(false)
    }
  }

  const handlePrimaryAction = async () => {
    setPrimaryActionIsPending(true)

    try {
      await onAction?.("primary")

      setOpen(false)
      onClose?.()
    }
    catch (error) {
      console.error("Dialog: Error in primary action:", error)
      if (closeOnError) {
        setOpen(false)
        onClose?.()
      }
    }
    finally {
      setPrimaryActionIsPending(false)
    }
  }

  return (
    <MUIDialog
      key={key}
      aria-describedby="dialog-content-text"
      aria-labelledby="dialog-title"
      className="ag-custom-component-popup"
      fullWidth
      keepMounted={keepMounted}
      open={open}
      sx={[
        fullWidth ? { "& .MuiPaper-root": { maxWidth: "100%" } } : {},
        fullHeight ? { "& .MuiPaper-root": { minHeight: "calc(100vh - 12rem)" } } : {},
        { "& .MuiDialogTitle-root + .MuiDialogContent-root": { p: 1 } },
        { "& .MuiDialogContent-root": { display: "flex" } },
      ]}
      onClose={handleCloseAction}
    >
      <MUIDialogTitle id="dialog-title" sx={{ fontSize: "h5.fontSize", pb: 1, pl: 1 }}>{title}</MUIDialogTitle>
      <MUIDialogContent>
        <Stack direction="column" spacing={1} sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Stack>
      </MUIDialogContent>
      <MUIDialogActions sx={{ pt: 0 }}>
        {!suppressCloseButton && (
          <Button
            color="inherit"
            onClick={handleCloseAction}
            ref={closeButtonRef}
            variant="text"
          >
            {closeButtonTitle}
          </Button>
        )}
        {!suppressPrimaryButton && (
          <Button
            color="primary"
            onClick={handlePrimaryAction}
            ref={primaryButtonRef}
            variant="contained"
          >
            {primaryButtonTitle}
          </Button>
        )}
      </MUIDialogActions>
    </MUIDialog>
  )
})

Dialog.displayName = "Dialog"
