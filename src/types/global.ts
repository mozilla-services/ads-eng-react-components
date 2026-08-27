// Helper types shared by every component in this package.
//
// These are declared twice on purpose:
//
//   - As named exports, re-exported from `src/index.ts`. TypeScript elides side-effect-only
//     imports from declaration output, so a named export is what actually keeps this module
//     (and the `declare global` block below) in `dist/index.d.ts` and therefore loaded in a
//     consumer's program.
import React from "react"

type ExtendableComponentBase<P = object> = React.FC<P> & {
  baseType?: symbol
}

type ExtendableComponentWithForwardedRefBase<P = object, T = unknown> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
> & {
  baseType?: symbol
}

export type ExtendableComponent<P = object> = ExtendableComponentBase<P>

export type ExtendableComponentWithForwardedRef<P = object, T = unknown>
  = ExtendableComponentWithForwardedRefBase<P, T>

declare global {
  type ExtendableComponent<P = object> = ExtendableComponentBase<P>

  type ExtendableComponentWithForwardedRef<P = object, T = unknown>
    = ExtendableComponentWithForwardedRefBase<P, T>
}
