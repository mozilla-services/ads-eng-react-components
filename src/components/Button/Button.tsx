import { CheckCircleOutline, ContentPaste, ErrorOutline } from "@mui/icons-material"
import {
  Button as MUIButton, // eslint-disable-line no-restricted-imports
  ButtonProps as MUIButtonProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"
import axios, { Method } from "axios"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Dialog, DialogAction, DialogHandle, DialogProps } from "../Dialog/Dialog"
import { Popover, PopoverHandle, PopoverProps } from "../Popover/Popover"
import { useNavigate } from "react-router-dom"
import { getNavigateToHrefClickHandler } from "../../utils/urls"
import { Tooltip } from "../Tooltip/Tooltip"
import { CircularProgress } from "../Progress/Progress"

const StyledButton = styled(MUIButton)`
  min-width: 2.40675rem;
  padding: 6px;
  text-transform: none;

  .MuiButton-icon {
    margin-top: -1px;
  }

  .MuiButton-endIcon {
    margin-right: -2px;
    margin-left: 4px;
  }

  .MuiButton-startIcon {
    margin-right: 4px;
    margin-left: -2px;
  }

  &[data-icon-only="true"] {
    .MuiButton-icon {
      margin-left: -4px;
      margin-right: -4px;
    }
  }
`

export interface ButtonProps extends Omit<MUIButtonProps, "onClick"> {
  circular?: boolean
  tooltipTitle?: string
  onClick?: React.MouseEventHandler
  onTooltipClose?: (event: React.SyntheticEvent | Event) => void
}

export const Button: ExtendableComponentWithForwardedRef<ButtonProps, HTMLButtonElement> = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const navigate = useNavigate()

  const iconOnly = React.Children.count(props.children) === 0

  const handleClick = getNavigateToHrefClickHandler(navigate, props.href, props.onClick)

  const filteredProps: Partial<ButtonProps> = { ...props }
  delete filteredProps.circular
  delete filteredProps.tooltipTitle
  delete filteredProps.onClick
  delete filteredProps.onTooltipClose

  return (
    <Tooltip
      arrow
      title={props.tooltipTitle}
      onClose={props.onTooltipClose}
    >
      {/* <Tooltip /> cannot directly wrap a disabled <Button />, so always wrap in a <span /> to handle this case */}
      <span style={{ borderRadius: props.circular ? "50%" : "0", display: "inline-block" }}>
        <StyledButton
          ref={ref}
          aria-label={props.tooltipTitle}
          data-icon-only={iconOnly}
          sx={[
            props.circular ? { borderRadius: "50%" } : {},
          ]}
          onClick={handleClick}
          {...filteredProps}
        />
      </span>
    </Tooltip>
  )
})

Button.displayName = "Button"
Button.baseType = Symbol.for(Button.displayName)

export interface DialogButtonProps extends Omit<ButtonProps, "ref" | "title">, Pick<DialogProps, "onAction" | "onClose" | "onOpen"> {
  dialogProps?: Omit<DialogProps, "onAction" | "onClose" | "onOpen">
  title?: React.ReactNode
}

export interface DialogButtonHandle {
  buttonRef: React.RefObject<HTMLButtonElement>
  dialogRef: React.RefObject<DialogHandle>
}

export const DialogButton: ExtendableComponentWithForwardedRef<DialogButtonProps, DialogButtonHandle> = forwardRef((props: DialogButtonProps, ref: React.ForwardedRef<DialogButtonHandle>) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<DialogHandle>(null)

  useImperativeHandle(ref, () => ({
    buttonRef,
    dialogRef,
  }))

  const onClick = (event: React.MouseEvent) => {
    dialogRef.current?.open()
    props.onClick?.(event)
  }

  const filteredProps: Partial<DialogButtonProps> = { ...props }
  delete filteredProps.dialogProps
  delete filteredProps.title
  delete filteredProps.onClick
  delete filteredProps.onAction
  delete filteredProps.onClose
  delete filteredProps.onOpen

  const dialogProps: DialogProps = {
    onAction: props.onAction,
    onClose: props.onClose,
    onOpen: props.onOpen,
    ...props.dialogProps,
  }

  return (
    <>
      <Button ref={buttonRef} onClick={onClick} {...filteredProps as Omit<DialogButtonProps, "title">}>{props.title}</Button>
      <Dialog ref={dialogRef} title={props.title} {...dialogProps}>
        {props.children}
      </Dialog>
    </>
  )
})

DialogButton.displayName = "DialogButton"
DialogButton.baseType = Button.baseType

export interface PopoverButtonProps extends Omit<ButtonProps, "ref" | "title">, Pick<PopoverProps, "onClose" | "onOpen"> {
  popoverProps?: Omit<PopoverProps, "anchorOrigin" | "anchorRef" | "transformOrigin">
  title?: React.ReactNode
}

export interface PopoverButtonHandle {
  buttonRef: React.RefObject<HTMLButtonElement>
  popoverRef: React.RefObject<PopoverHandle>
}

export const PopoverButton: ExtendableComponentWithForwardedRef<PopoverButtonProps, PopoverButtonHandle> = forwardRef((props: PopoverButtonProps, ref: React.ForwardedRef<PopoverButtonHandle>) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<PopoverHandle>(null)

  useImperativeHandle(ref, () => ({
    buttonRef,
    popoverRef,
  }))

  const onClick = () => {
    popoverRef.current?.open()
  }

  const filteredProps: Partial<PopoverButtonProps> = { ...props }
  delete filteredProps.popoverProps
  delete filteredProps.title
  delete filteredProps.onClick
  delete filteredProps.onClose
  delete filteredProps.onOpen

  const popoverProps: Omit<PopoverProps, "anchorRef"> = {
    onClose: props.onClose,
    onOpen: props.onOpen,
    ...props.popoverProps,
  }

  return (
    <>
      <Button ref={buttonRef} onClick={onClick} {...filteredProps as Omit<PopoverButtonProps, "title">}>{props.title}</Button>
      <Popover ref={popoverRef} anchorRef={buttonRef} {...popoverProps}>
        {props.children}
      </Popover>
    </>
  )
})

PopoverButton.displayName = "PopoverButton"
PopoverButton.baseType = Button.baseType

type AsyncButtonStatus = "default" | "pending" | "success" | "failure"

const asyncButtonStatusToColor: Record<AsyncButtonStatus, ButtonProps["color"]> = {
  default: "primary",
  pending: "primary",
  success: "success",
  failure: "error",
}

interface AsyncButtonStatusIconProps {
  status: AsyncButtonStatus
  defaultIcon?: React.ReactNode
  pendingIcon?: React.ReactNode
  successIcon?: React.ReactNode
  failureIcon?: React.ReactNode
  suppressStatusIcon?: boolean
}

const AsyncButtonStatusIcon = ({
  status,
  defaultIcon,
  pendingIcon,
  successIcon,
  failureIcon,
  suppressStatusIcon,
}: AsyncButtonStatusIconProps) => {
  if (suppressStatusIcon) {
    return null
  }

  if (status === "pending") {
    return pendingIcon ?? (<CircularProgress size="1em" sx={{ ml: 1, mb: 0.25 }} />)
  }
  else if (status === "failure") {
    return failureIcon ?? (<ErrorOutline fontSize="small" sx={{ ml: 0.5, mb: 0.25 }} />)
  }
  else if (status === "success") {
    return successIcon ?? (<CheckCircleOutline fontSize="small" sx={{ ml: 0.5, mb: 0.25 }} />)
  }

  return defaultIcon
}

export interface AsyncButtonProps extends ButtonProps {
  confirmTitle?: string
  confirmContent?: React.ReactNode
  defaultIcon?: React.ReactNode
  pendingIcon?: React.ReactNode
  successIcon?: React.ReactNode
  failureIcon?: React.ReactNode
  suppressStatusColor?: boolean
  suppressStatusIcon?: boolean
  onClick?: () => Promise<unknown>
  onSuccess?: (result?: unknown) => void
  onFailure?: (error?: unknown) => void
}

export const AsyncButton: ExtendableComponentWithForwardedRef<AsyncButtonProps, HTMLButtonElement> = forwardRef((props: AsyncButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const [status, setStatus] = useState<AsyncButtonStatus>("default")
  const [currentTooltipTitle, setCurrentTooltipTitle] = useState<string | undefined>(props.tooltipTitle)
  const confirmDialogRef = useRef<DialogHandle>(null)

  const onClick = async () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.open()
      return
    }

    await onAction("primary")
  }

  const onAction = async (dialogAction: DialogAction) => {
    if (dialogAction === "primary") {
      setStatus("pending")

      try {
        const result = await props.onClick?.()
        setStatus("success")

        if (result && typeof result === "string") {
          setCurrentTooltipTitle(result)
        }

        props.onSuccess?.(result)
      }
      catch (error: unknown) {
        setStatus("failure")

        let message = "An error occurred"
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { data?: unknown } }
          if (axiosError.response?.data) {
            const responseData = axiosError.response.data
            if (typeof responseData === "string") {
              message = responseData
            }
            else if (typeof responseData === "object") {
              const firstError = Object.values(responseData as Record<string, unknown>)[0]
              if (Array.isArray(firstError)) {
                message = String(firstError[0])
              }
              else if (firstError) {
                message = String(firstError)
              }
            }
          }
        }
        else if (error instanceof Error) {
          message = error.message
        }

        setCurrentTooltipTitle(message)
        props.onFailure?.(error)
      }
    }
  }

  const handleTooltipClose = () => {
    setTimeout(() => {
      setCurrentTooltipTitle(props.tooltipTitle)
    }, 300)
  }

  const filteredProps: Partial<AsyncButtonProps> = { ...props }
  delete filteredProps.children
  delete filteredProps.color
  delete filteredProps.disabled
  delete filteredProps.confirmTitle
  delete filteredProps.confirmContent
  delete filteredProps.defaultIcon
  delete filteredProps.pendingIcon
  delete filteredProps.successIcon
  delete filteredProps.failureIcon
  delete filteredProps.suppressStatusColor
  delete filteredProps.suppressStatusIcon
  delete filteredProps.tooltipTitle
  delete filteredProps.onClick
  delete filteredProps.onSuccess
  delete filteredProps.onFailure
  delete filteredProps.onTooltipClose

  return (
    <>
      <Button
        ref={ref}
        color={!props.suppressStatusColor ? asyncButtonStatusToColor[status] : undefined}
        disabled={status === "pending" || props.disabled}
        tooltipTitle={currentTooltipTitle}
        onClick={onClick}
        onTooltipClose={handleTooltipClose}
        {...filteredProps}
      >
        {props.children}
        <AsyncButtonStatusIcon status={status} {...props} />
      </Button>
      {props.confirmContent ? <Dialog ref={confirmDialogRef} title={props.confirmTitle ?? "Confirm"} onAction={onAction}>{props.confirmContent}</Dialog> : <></>}
    </>
  )
})

AsyncButton.displayName = "AsyncButton"
AsyncButton.baseType = Button.baseType

function extractResponseMessage(data: unknown): string | undefined {
  if (!data) return undefined
  if (typeof data === "string") return data
  if (typeof data === "object") {
    const firstValue = Object.values(data as Record<string, unknown>)[0]
    if (Array.isArray(firstValue)) return String(firstValue[0])
    if (firstValue) return String(firstValue)
  }
  return undefined
}

function makeRemoteRequest(props: RemoteButtonProps) {
  return axios.request({
    url: props.url,
    method: props.method,
    data: props.data,
    params: props.params,
  })
}

export interface RemoteButtonProps extends Omit<AsyncButtonProps, "onClick"> {
  url: string
  method?: Method
  data?: Record<string, unknown>
  params?: URLSearchParams
}

export const RemoteButton: ExtendableComponentWithForwardedRef<RemoteButtonProps, HTMLButtonElement> = forwardRef((props: RemoteButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const filteredProps: Partial<RemoteButtonProps> = { ...props }

  const onClick = async () => {
    const response = await makeRemoteRequest(props)
    return extractResponseMessage(response.data)
  }

  return (
    <AsyncButton onClick={onClick} ref={ref} {...filteredProps} />
  )
})

RemoteButton.displayName = "RemoteButton"
RemoteButton.baseType = Button.baseType

export interface ClipboardButtonProps extends Omit<ButtonProps, "onClick"> {
  data: number | string | null
  copiedTooltipTitle?: string
}

export const ClipboardButton: ExtendableComponentWithForwardedRef<ClipboardButtonProps, HTMLButtonElement> = forwardRef((props: ClipboardButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const tooltipTitle = props.tooltipTitle ?? "Copy"
  const copiedTooltipTitle = props.copiedTooltipTitle ?? "Copied!"
  const [currentTooltipTitle, setCurrentTooltipTitle] = useState<string>(tooltipTitle)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(props.data !== null ? `${props.data}` : "")
      setCurrentTooltipTitle(copiedTooltipTitle)
    }
    catch { /* Do nothing if `data` could not be written to the clipboard */ }
  }

  const handleTooltipClose = () => {
    setTimeout(() => {
      setCurrentTooltipTitle(tooltipTitle)
    }, 300)
  }

  const filteredProps: Partial<ClipboardButtonProps> = { ...props }
  delete filteredProps.data
  delete filteredProps.copiedTooltipTitle
  delete filteredProps.startIcon
  delete filteredProps.tooltipTitle
  delete filteredProps.onTooltipClose

  return (
    <Button onClick={handleClick} startIcon={<ContentPaste />} tooltipTitle={currentTooltipTitle} onTooltipClose={handleTooltipClose} ref={ref} {...filteredProps} />
  )
})

ClipboardButton.displayName = "ClipboardButton"
ClipboardButton.baseType = Button.baseType
