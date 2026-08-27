import {
  ToastContainer as ToastifyContainer,
  ToastContainerProps as ToastifyContainerProps,
} from "react-toastify"
import { useTheme } from "../../hooks/useTheme"

export type ToastContainerProps = ToastifyContainerProps

export const ToastContainer = (props: ToastContainerProps) => {
  const [themeState] = useTheme()

  return (
    <ToastifyContainer
      theme={themeState.mode}
      {...props}
    />
  )
}

ToastContainer.displayName = "ToastContainer"
