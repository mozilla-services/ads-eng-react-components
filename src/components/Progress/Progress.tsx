import {
  CircularProgress as MUICircularProgress, // eslint-disable-line no-restricted-imports
  CircularProgressProps as MUICircularProgressProps, // eslint-disable-line no-restricted-imports
  LinearProgress as MUILinearProgress, // eslint-disable-line no-restricted-imports
  LinearProgressProps as MUILinearProgressProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"

export type CircularProgressProps = MUICircularProgressProps

export const CircularProgress: ExtendableComponent<CircularProgressProps> = (props: CircularProgressProps) => {
  return (
    <MUICircularProgress color="inherit" {...props} />
  )
}

CircularProgress.displayName = "CircularProgress"
CircularProgress.baseType = Symbol.for(CircularProgress.displayName)

export type LinearProgressProps = MUILinearProgressProps

export const LinearProgress: ExtendableComponent<LinearProgressProps> = (props: LinearProgressProps) => {
  return (
    <MUILinearProgress {...props} />
  )
}

LinearProgress.displayName = "LinearProgress"
LinearProgress.baseType = Symbol.for(LinearProgress.displayName)
